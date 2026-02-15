from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import DailySummary
from .serializers import DailySummarySerializer


class DailySummaryViewSet(viewsets.ModelViewSet):
	serializer_class = DailySummarySerializer
	permission_classes = [IsAuthenticated]
	filterset_fields = ['date']
	ordering_fields = ['date', 'created_at']

	def get_queryset(self):
		return DailySummary.objects.filter(user=self.request.user)

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)
