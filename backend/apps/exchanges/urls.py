from django.urls import path
from .views import (
    ExchangeListCreateView, ExchangeDetailView,
    sent_exchanges, received_exchanges,
    accept_exchange, reject_exchange, cancel_exchange,
    start_exchange, complete_exchange,
)

urlpatterns = [
    path('', ExchangeListCreateView.as_view(), name='exchange-list-create'),
    path('sent/', sent_exchanges, name='exchange-sent'),
    path('received/', received_exchanges, name='exchange-received'),
    path('<int:pk>/', ExchangeDetailView.as_view(), name='exchange-detail'),
    path('<int:pk>/accept/', accept_exchange, name='exchange-accept'),
    path('<int:pk>/reject/', reject_exchange, name='exchange-reject'),
    path('<int:pk>/cancel/', cancel_exchange, name='exchange-cancel'),
    path('<int:pk>/start/', start_exchange, name='exchange-start'),
    path('<int:pk>/complete/', complete_exchange, name='exchange-complete'),
]
