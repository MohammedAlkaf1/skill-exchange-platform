from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['reviewer', 'reviewed_user', 'rating', 'exchange_request', 'created_at']
    list_filter = ['rating']
    search_fields = ['reviewer__username', 'reviewed_user__username', 'feedback']
    ordering = ['-created_at']
    raw_id_fields = ['reviewer', 'reviewed_user', 'exchange_request']
    readonly_fields = ['created_at']
