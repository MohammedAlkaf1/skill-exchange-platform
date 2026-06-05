from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import ExchangeRequest
from .serializers import ExchangeRequestSerializer, ExchangeRequestCreateSerializer
from apps.notifications.services import create_notification


class ExchangeListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ExchangeRequestCreateSerializer
        return ExchangeRequestSerializer

    def get_queryset(self):
        user = self.request.user
        return ExchangeRequest.objects.filter(
            sender=user
        ) | ExchangeRequest.objects.filter(receiver=user)

    def get_serializer_context(self):
        return {'request': self.request}

    def create(self, request, *args, **kwargs):
        serializer = ExchangeRequestCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            exchange = serializer.save()
            create_notification(
                user=exchange.receiver,
                title='New Exchange Request',
                message=f'{exchange.sender.full_name} sent you an exchange request.',
            )
            return Response(
                ExchangeRequestSerializer(exchange, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def sent_exchanges(request):
    exchanges = ExchangeRequest.objects.filter(sender=request.user).order_by('-created_at')
    serializer = ExchangeRequestSerializer(exchanges, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def received_exchanges(request):
    exchanges = ExchangeRequest.objects.filter(receiver=request.user).order_by('-created_at')
    serializer = ExchangeRequestSerializer(exchanges, many=True, context={'request': request})
    return Response(serializer.data)


class ExchangeDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ExchangeRequestSerializer

    def get_queryset(self):
        user = self.request.user
        return ExchangeRequest.objects.filter(sender=user) | ExchangeRequest.objects.filter(receiver=user)

    def get_serializer_context(self):
        return {'request': self.request}


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def accept_exchange(request, pk):
    try:
        exchange = ExchangeRequest.objects.get(pk=pk, receiver=request.user)
    except ExchangeRequest.DoesNotExist:
        return Response({'detail': 'Exchange not found or not authorized.'}, status=404)

    if exchange.status != 'pending':
        return Response({'detail': 'This exchange request is no longer pending.'}, status=400)

    exchange.status = 'accepted'
    exchange.save()
    create_notification(
        user=exchange.sender,
        title='Exchange Request Accepted',
        message=f'{exchange.receiver.full_name} accepted your exchange request.',
    )
    return Response(ExchangeRequestSerializer(exchange, context={'request': request}).data)


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def reject_exchange(request, pk):
    try:
        exchange = ExchangeRequest.objects.get(pk=pk, receiver=request.user)
    except ExchangeRequest.DoesNotExist:
        return Response({'detail': 'Exchange not found or not authorized.'}, status=404)

    if exchange.status != 'pending':
        return Response({'detail': 'This exchange request is no longer pending.'}, status=400)

    exchange.status = 'rejected'
    exchange.save()
    create_notification(
        user=exchange.sender,
        title='Exchange Request Rejected',
        message=f'{exchange.receiver.full_name} rejected your exchange request.',
    )
    return Response(ExchangeRequestSerializer(exchange, context={'request': request}).data)


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def cancel_exchange(request, pk):
    try:
        exchange = ExchangeRequest.objects.get(pk=pk, sender=request.user)
    except ExchangeRequest.DoesNotExist:
        return Response({'detail': 'Exchange not found or not authorized.'}, status=404)

    if exchange.status != 'pending':
        return Response({'detail': 'This exchange request is no longer pending.'}, status=400)

    exchange.status = 'cancelled'
    exchange.save()
    create_notification(
        user=exchange.receiver,
        title='Exchange Request Cancelled',
        message=f'{exchange.sender.full_name} cancelled their exchange request.',
    )
    return Response(ExchangeRequestSerializer(exchange, context={'request': request}).data)


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def start_exchange(request, pk):
    user = request.user
    try:
        exchange = ExchangeRequest.objects.get(pk=pk)
    except ExchangeRequest.DoesNotExist:
        return Response({'detail': 'Exchange not found.'}, status=404)

    if user not in [exchange.sender, exchange.receiver]:
        return Response({'detail': 'Not authorized.'}, status=403)

    if exchange.status != 'accepted':
        return Response({'detail': 'Only accepted exchanges can be started.'}, status=400)

    exchange.status = 'in_progress'
    exchange.save()
    return Response(ExchangeRequestSerializer(exchange, context={'request': request}).data)


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def complete_exchange(request, pk):
    user = request.user
    try:
        exchange = ExchangeRequest.objects.get(pk=pk)
    except ExchangeRequest.DoesNotExist:
        return Response({'detail': 'Exchange not found.'}, status=404)

    if user not in [exchange.sender, exchange.receiver]:
        return Response({'detail': 'Not authorized.'}, status=403)

    if exchange.status not in ['accepted', 'in_progress']:
        return Response({'detail': 'Only accepted or in-progress exchanges can be completed.'}, status=400)

    exchange.status = 'completed'
    exchange.completed_at = timezone.now()
    exchange.save()

    # Increment exchange counts for both users
    exchange.sender.completed_exchanges_count += 1
    exchange.sender.save(update_fields=['completed_exchanges_count'])
    exchange.receiver.completed_exchanges_count += 1
    exchange.receiver.save(update_fields=['completed_exchanges_count'])

    # Recalculate reputation
    exchange.sender.recalculate_reputation()
    exchange.receiver.recalculate_reputation()

    create_notification(
        user=exchange.sender,
        title='Exchange Completed',
        message=f'Your exchange with {exchange.receiver.full_name} is marked as completed. Please leave a review!',
    )
    create_notification(
        user=exchange.receiver,
        title='Exchange Completed',
        message=f'Your exchange with {exchange.sender.full_name} is marked as completed. Please leave a review!',
    )
    return Response(ExchangeRequestSerializer(exchange, context={'request': request}).data)
