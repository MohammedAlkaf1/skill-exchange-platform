from django.urls import path
from .views import UserListView, UserDetailView, user_reviews, user_skills

urlpatterns = [
    path('', UserListView.as_view(), name='user-list'),
    path('<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('<int:pk>/reviews/', user_reviews, name='user-reviews'),
    path('<int:pk>/skills/', user_skills, name='user-skills'),
]
