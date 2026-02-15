"""URL Configuration"""

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('apps.users.urls')),
    path('api/v1/assignments/', include('apps.assignments.urls')),
    path('api/v1/focus/', include('apps.focus.urls')),
    path('api/v1/notes/', include('apps.notes.urls')),
    path('api/v1/learning/', include('apps.learning_logs.urls')),
    path('api/v1/analytics/', include('apps.analytics.urls')),
    path('api/v1/streaks/', include('apps.streaks.urls')),
]
