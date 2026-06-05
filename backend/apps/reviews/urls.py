from django.urls import path
from .views import ReviewListCreateView, ReviewDetailView, user_reviews

urlpatterns = [
    path('', ReviewListCreateView.as_view(), name='review-list-create'),
    path('<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),
    path('user/<int:user_id>/', user_reviews, name='user-reviews-by-id'),
]
