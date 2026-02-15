from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import LearningLog
from .serializers import LearningLogSerializer


class LearningLogViewSet(viewsets.ModelViewSet):
	serializer_class = LearningLogSerializer
	permission_classes = [IsAuthenticated]
	filterset_fields = ['logged_at']
	search_fields = ['topic']
	ordering_fields = ['logged_at', 'created_at']

	def get_queryset(self):
		return LearningLog.objects.filter(user=self.request.user)

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)
