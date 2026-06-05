from django.db import models
from django.conf import settings


class Skill(models.Model):
    CATEGORY_CHOICES = [
        ('programming', 'Programming'),
        ('graphic_design', 'Graphic Design'),
        ('writing', 'Writing'),
        ('marketing', 'Marketing'),
        ('languages', 'Languages'),
        ('video_editing', 'Video Editing'),
        ('photography', 'Photography'),
        ('music', 'Music'),
        ('business', 'Business'),
        ('tutoring', 'Tutoring'),
        ('data_analysis', 'Data Analysis'),
        ('ui_ux_design', 'UI/UX Design'),
        ('social_media', 'Social Media'),
        ('other', 'Other'),
    ]

    TYPE_CHOICES = [
        ('offered', 'Offered'),
        ('wanted', 'Wanted'),
    ]

    LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    skill_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    level = models.CharField(max_length=15, choices=LEVEL_CHOICES)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'skills'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} ({self.skill_type}) - {self.user.username}'
