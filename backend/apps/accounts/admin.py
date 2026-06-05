from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'full_name', 'reputation_score', 'get_reputation_level', 'is_active', 'is_staff', 'created_at']
    list_filter = ['is_active', 'is_staff', 'availability']
    search_fields = ['username', 'email', 'full_name', 'location']
    ordering = ['-reputation_score']
    readonly_fields = ['reputation_score', 'average_rating', 'completed_exchanges_count', 'reviews_count', 'created_at', 'updated_at']

    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'profile_image', 'bio', 'location', 'availability')}),
        ('Reputation', {'fields': ('reputation_score', 'average_rating', 'completed_exchanges_count', 'reviews_count')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'full_name', 'password1', 'password2'),
        }),
    )

    def get_reputation_level(self, obj):
        return obj.get_reputation_level()
    get_reputation_level.short_description = 'Reputation Level'
