from django.contrib import admin
from .models import ExchangeRequest


@admin.register(ExchangeRequest)
class ExchangeRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'sender', 'receiver', 'requested_skill', 'status', 'created_at', 'completed_at']
    list_filter = ['status']
    search_fields = ['sender__username', 'receiver__username', 'requested_skill__name']
    ordering = ['-created_at']
    raw_id_fields = ['sender', 'receiver', 'requested_skill', 'offered_skill']
    readonly_fields = ['created_at', 'updated_at', 'completed_at']
