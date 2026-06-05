from rest_framework import serializers
from .models import Review
from apps.accounts.serializers import UserPublicSerializer


class ReviewSerializer(serializers.ModelSerializer):
    reviewer = UserPublicSerializer(read_only=True)
    reviewed_user = UserPublicSerializer(read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'exchange_request', 'reviewer', 'reviewed_user',
            'rating', 'feedback', 'created_at',
        ]
        read_only_fields = ['id', 'reviewer', 'reviewed_user', 'created_at']


class ReviewCreateSerializer(serializers.ModelSerializer):
    exchange_request_id = serializers.IntegerField(write_only=True)
    reviewed_user_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Review
        fields = ['exchange_request_id', 'reviewed_user_id', 'rating', 'feedback']

    def validate(self, data):
        from apps.exchanges.models import ExchangeRequest
        from apps.accounts.models import User

        reviewer = self.context['request'].user

        try:
            exchange = ExchangeRequest.objects.get(pk=data['exchange_request_id'])
        except ExchangeRequest.DoesNotExist:
            raise serializers.ValidationError({'exchange_request_id': 'Exchange not found.'})

        if exchange.status != 'completed':
            raise serializers.ValidationError('You can only review completed exchanges.')

        if reviewer not in [exchange.sender, exchange.receiver]:
            raise serializers.ValidationError('You are not part of this exchange.')

        try:
            reviewed_user = User.objects.get(pk=data['reviewed_user_id'])
        except User.DoesNotExist:
            raise serializers.ValidationError({'reviewed_user_id': 'User not found.'})

        if reviewed_user == reviewer:
            raise serializers.ValidationError('You cannot review yourself.')

        if reviewed_user not in [exchange.sender, exchange.receiver]:
            raise serializers.ValidationError('The reviewed user is not part of this exchange.')

        if Review.objects.filter(exchange_request=exchange, reviewer=reviewer).exists():
            raise serializers.ValidationError('You have already reviewed this exchange.')

        rating = data.get('rating')
        if rating and (rating < 1 or rating > 5):
            raise serializers.ValidationError({'rating': 'Rating must be between 1 and 5.'})

        data['exchange_request'] = exchange
        data['reviewed_user'] = reviewed_user
        data['reviewer'] = reviewer
        return data

    def create(self, validated_data):
        validated_data.pop('exchange_request_id', None)
        validated_data.pop('reviewed_user_id', None)
        review = Review.objects.create(**validated_data)
        review.reviewed_user.recalculate_reputation()
        return review
