from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/users/', include('apps.accounts.user_urls')),
    path('api/skills/', include('apps.skills.urls')),
    path('api/exchanges/', include('apps.exchanges.urls')),
    path('api/reviews/', include('apps.reviews.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
