from rest_framework.routers import DefaultRouter

from .views import AssignmentViewSet, SubjectViewSet

router = DefaultRouter()
router.register('subjects', SubjectViewSet, basename='subjects')
router.register('', AssignmentViewSet, basename='assignments')

urlpatterns = router.urls
