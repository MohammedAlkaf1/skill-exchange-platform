from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Skill
from .serializers import SkillSerializer, SkillCreateSerializer
from apps.accounts.models import User
from apps.accounts.serializers import UserPublicSerializer


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user


class SkillListCreateView(generics.ListCreateAPIView):
    queryset = Skill.objects.select_related('user').all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'skill_type', 'level']
    search_fields = ['name', 'description', 'user__location']
    ordering_fields = ['created_at', 'name']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SkillCreateSerializer
        return SkillSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_serializer_context(self):
        return {'request': self.request}


class SkillDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Skill.objects.select_related('user').all()
    permission_classes = [IsOwnerOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return SkillCreateSerializer
        return SkillSerializer

    def get_serializer_context(self):
        return {'request': self.request}

    def destroy(self, request, *args, **kwargs):
        skill = self.get_object()
        if skill.user != request.user:
            return Response(
                {'detail': 'You are not allowed to delete this skill.'},
                status=status.HTTP_403_FORBIDDEN
            )
        skill.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_skills(request):
    skills = Skill.objects.filter(user=request.user).order_by('-created_at')
    serializer = SkillSerializer(skills, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def search_skills(request):
    queryset = Skill.objects.select_related('user').filter(user__is_active=True)

    keyword = request.query_params.get('keyword', '')
    category = request.query_params.get('category', '')
    skill_type = request.query_params.get('skill_type', '')
    level = request.query_params.get('level', '')
    location = request.query_params.get('location', '')

    if keyword:
        queryset = queryset.filter(name__icontains=keyword)
    if category:
        queryset = queryset.filter(category=category)
    if skill_type:
        queryset = queryset.filter(skill_type=skill_type)
    if level:
        queryset = queryset.filter(level=level)
    if location:
        queryset = queryset.filter(user__location__icontains=location)

    queryset = queryset.order_by('-user__reputation_score', '-created_at')
    serializer = SkillSerializer(queryset, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def recommended_matches(request):
    """Return users who offer skills that the logged-in user wants."""
    wanted_skill_names = Skill.objects.filter(
        user=request.user, skill_type='wanted'
    ).values_list('name', flat=True)

    offered_skills = Skill.objects.filter(
        skill_type='offered',
        name__in=wanted_skill_names,
        user__is_active=True,
    ).exclude(user=request.user).select_related('user')

    matched_users = {}
    for skill in offered_skills:
        uid = skill.user.id
        if uid not in matched_users:
            matched_users[uid] = skill.user

    users = sorted(matched_users.values(), key=lambda u: -u.reputation_score)
    serializer = UserPublicSerializer(users, many=True, context={'request': request})
    return Response(serializer.data)
