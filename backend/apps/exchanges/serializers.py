from rest_framework import serializers
from .models import ExchangeRequest
from apps.accounts.serializers import UserPublicSerializer
from apps.skills.serializers import SkillSerializer


class ExchangeRequestSerializer(serializers.ModelSerializer):
    sender = UserPublicSerializer(read_only=True)
    receiver = UserPublicSerializer(read_only=True)
    requested_skill = SkillSerializer(read_only=True)
    offered_skill = SkillSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    can_review = serializers.SerializerMethodField()

    class Meta:
        model = ExchangeRequest
        fields = [
            'id', 'sender', 'receiver', 'requested_skill', 'offered_skill',
            'message', 'status', 'status_display', 'created_at', 'updated_at',
            'completed_at', 'can_review',
        ]

    def get_can_review(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        if obj.status != 'completed':
            return False
        from apps.reviews.models import Review
        already_reviewed = Review.objects.filter(
            exchange_request=obj,
            reviewer=request.user
        ).exists()
        return not already_reviewed


class ExchangeRequestCreateSerializer(serializers.ModelSerializer):
    receiver_id = serializers.IntegerField(write_only=True)
    requested_skill_id = serializers.IntegerField(write_only=True)
    offered_skill_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = ExchangeRequest
        fields = ['receiver_id', 'requested_skill_id', 'offered_skill_id', 'message']

    def validate(self, data):
        from apps.accounts.models import User
        from apps.skills.models import Skill

        sender = self.context['request'].user
        try:
            receiver = User.objects.get(pk=data['receiver_id'], is_active=True)
        except User.DoesNotExist:
            raise serializers.ValidationError({'receiver_id': 'User not found.'})

        if sender.id == receiver.id:
            raise serializers.ValidationError('You cannot send an exchange request to yourself.')

        try:
            requested_skill = Skill.objects.get(pk=data['requested_skill_id'])
        except Skill.DoesNotExist:
            raise serializers.ValidationError({'requested_skill_id': 'Skill not found.'})

        data['sender'] = sender
        data['receiver'] = receiver
        data['requested_skill'] = requested_skill

        if data.get('offered_skill_id'):
            try:
                offered_skill = Skill.objects.get(pk=data['offered_skill_id'], user=sender)
            except Skill.DoesNotExist:
                raise serializers.ValidationError({'offered_skill_id': 'Offered skill not found or not yours.'})
            data['offered_skill'] = offered_skill

        return data

    def create(self, validated_data):
        validated_data.pop('receiver_id', None)
        validated_data.pop('requested_skill_id', None)
        validated_data.pop('offered_skill_id', None)
        return ExchangeRequest.objects.create(**validated_data)
