from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Streak
from .serializers import StreakSerializer


class StreakViewSet(viewsets.ModelViewSet):
	serializer_class = StreakSerializer
	permission_classes = [IsAuthenticated]
	filterset_fields = ['streak_type', 'last_activity_date']
	ordering_fields = ['last_activity_date', 'created_at']

	def get_queryset(self):
		return Streak.objects.filter(user=self.request.user)

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)
