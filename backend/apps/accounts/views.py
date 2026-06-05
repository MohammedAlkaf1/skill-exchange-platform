from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .models import User
from .serializers import (
    RegisterSerializer, LoginSerializer,
    UserPublicSerializer, UserDetailSerializer, UserUpdateSerializer
)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Registration successful.',
                'user': UserDetailSerializer(user, context={'request': request}).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Login successful.',
                'user': UserDetailSerializer(user, context={'request': request}).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Logged out successfully.'})
        except TokenError:
            return Response({'message': 'Logged out successfully.'})


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserDetailSerializer(request.user, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserDetailSerializer(user, context={'request': request}).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        request.user.is_active = False
        request.user.save()
        return Response({'message': 'Account deactivated.'}, status=status.HTTP_204_NO_CONTENT)


# --- User list & detail (public) ---

class UserListView(generics.ListAPIView):
    queryset = User.objects.filter(is_active=True).order_by('-reputation_score')
    serializer_class = UserPublicSerializer
    permission_classes = [permissions.AllowAny]
    search_fields = ['full_name', 'username', 'location', 'bio']
    filterset_fields = ['location', 'availability']

    def get_serializer_context(self):
        return {'request': self.request}


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        return {'request': self.request}


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def user_reviews(request, pk):
    from apps.reviews.serializers import ReviewSerializer
    from apps.reviews.models import Review
    try:
        user = User.objects.get(pk=pk, is_active=True)
    except User.DoesNotExist:
        return Response({'detail': 'User not found.'}, status=404)
    reviews = Review.objects.filter(reviewed_user=user).order_by('-created_at')
    serializer = ReviewSerializer(reviews, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def user_skills(request, pk):
    from apps.skills.serializers import SkillSerializer
    try:
        user = User.objects.get(pk=pk, is_active=True)
    except User.DoesNotExist:
        return Response({'detail': 'User not found.'}, status=404)
    skills = user.skills.all().order_by('-created_at')
    serializer = SkillSerializer(skills, many=True, context={'request': request})
    return Response(serializer.data)
