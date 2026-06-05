from django.urls import path
from .views import SkillListCreateView, SkillDetailView, my_skills, search_skills, recommended_matches

urlpatterns = [
    path('', SkillListCreateView.as_view(), name='skill-list-create'),
    path('my-skills/', my_skills, name='my-skills'),
    path('search/', search_skills, name='skill-search'),
    path('matches/', recommended_matches, name='skill-matches'),
    path('<int:pk>/', SkillDetailView.as_view(), name='skill-detail'),
]
