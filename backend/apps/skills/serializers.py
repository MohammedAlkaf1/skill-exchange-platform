from rest_framework import serializers
from .models import Skill
from apps.accounts.serializers import UserPublicSerializer


class SkillSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    type_display = serializers.CharField(source='get_skill_type_display', read_only=True)
    level_display = serializers.CharField(source='get_level_display', read_only=True)

    class Meta:
        model = Skill
        fields = [
            'id', 'user', 'name', 'category', 'category_display',
            'skill_type', 'type_display', 'level', 'level_display',
            'description', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class SkillCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'skill_type', 'level', 'description']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
