from rest_framework.routers import DefaultRouter

from .views import LearningLogViewSet

router = DefaultRouter()
router.register('logs', LearningLogViewSet, basename='learning-logs')

urlpatterns = router.urls
