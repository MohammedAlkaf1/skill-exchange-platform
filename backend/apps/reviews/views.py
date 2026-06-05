from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer
from apps.notifications.services import create_notification


class ReviewListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ReviewCreateSerializer
        return ReviewSerializer

    def get_queryset(self):
        return Review.objects.select_related('reviewer', 'reviewed_user').all()

    def get_serializer_context(self):
        return {'request': self.request}

    def create(self, request, *args, **kwargs):
        serializer = ReviewCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            review = serializer.save()
            create_notification(
                user=review.reviewed_user,
                title='New Review Received',
                message=f'{review.reviewer.full_name} gave you a {review.rating}-star review.',
            )
            return Response(
                ReviewSerializer(review, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReviewDetailView(generics.RetrieveAPIView):
    queryset = Review.objects.select_related('reviewer', 'reviewed_user').all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        return {'request': self.request}


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def user_reviews(request, user_id):
    reviews = Review.objects.filter(reviewed_user_id=user_id).order_by('-created_at')
    serializer = ReviewSerializer(reviews, many=True, context={'request': request})
    return Response(serializer.data)
