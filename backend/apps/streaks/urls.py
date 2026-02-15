from rest_framework.routers import DefaultRouter

from .views import StreakViewSet

router = DefaultRouter()
router.register('', StreakViewSet, basename='streaks')

urlpatterns = router.urls
