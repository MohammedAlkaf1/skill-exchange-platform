from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'is_read', 'created_at']
    list_filter = ['is_read']
    search_fields = ['user__username', 'title', 'message']
    ordering = ['-created_at']
    raw_id_fields = ['user']
    readonly_fields = ['created_at']
