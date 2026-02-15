from rest_framework.routers import DefaultRouter

from .views import DailySummaryViewSet

router = DefaultRouter()
router.register('summaries', DailySummaryViewSet, basename='daily-summaries')

urlpatterns = router.urls
