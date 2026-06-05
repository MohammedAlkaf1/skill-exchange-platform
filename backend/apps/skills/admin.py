from django.contrib import admin
from .models import Skill


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'category', 'skill_type', 'level', 'created_at']
    list_filter = ['category', 'skill_type', 'level']
    search_fields = ['name', 'user__username', 'description']
    ordering = ['-created_at']
    raw_id_fields = ['user']
