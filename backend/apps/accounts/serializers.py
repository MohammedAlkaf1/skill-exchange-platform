from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'full_name', 'username', 'email', 'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email_or_username = data['email']
        password = data['password']

        # Allow login by username or email
        user = None
        if '@' in email_or_username:
            user = authenticate(email=email_or_username, password=password)
        else:
            try:
                u = User.objects.get(username=email_or_username)
                user = authenticate(email=u.email, password=password)
            except User.DoesNotExist:
                pass

        if not user:
            raise serializers.ValidationError('Invalid credentials. Please try again.')
        if not user.is_active:
            raise serializers.ValidationError('This account has been deactivated.')

        data['user'] = user
        return data


class UserPublicSerializer(serializers.ModelSerializer):
    reputation_level = serializers.SerializerMethodField()
    profile_image_url = serializers.SerializerMethodField()
    skills_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'full_name', 'username', 'profile_image_url',
            'bio', 'location', 'availability', 'reputation_score',
            'reputation_level', 'average_rating', 'completed_exchanges_count',
            'reviews_count', 'created_at', 'skills_count',
        ]

    def get_reputation_level(self, obj):
        return obj.get_reputation_level()

    def get_profile_image_url(self, obj):
        request = self.context.get('request')
        if obj.profile_image and request:
            return request.build_absolute_uri(obj.profile_image.url)
        return None

    def get_skills_count(self, obj):
        return obj.skills.count()


class UserDetailSerializer(UserPublicSerializer):
    class Meta(UserPublicSerializer.Meta):
        fields = UserPublicSerializer.Meta.fields + ['email', 'updated_at']


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'bio', 'location', 'availability', 'profile_image']

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
