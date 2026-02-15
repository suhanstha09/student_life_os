from rest_framework.routers import DefaultRouter

from .views import FocusSessionViewSet

router = DefaultRouter()
router.register('sessions', FocusSessionViewSet, basename='focus-sessions')

urlpatterns = router.urls
