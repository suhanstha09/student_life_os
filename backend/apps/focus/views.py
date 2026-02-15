from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import FocusSession
from .serializers import FocusSessionSerializer


class FocusSessionViewSet(viewsets.ModelViewSet):
	serializer_class = FocusSessionSerializer
	permission_classes = [IsAuthenticated]
	filterset_fields = ['started_at']
	search_fields = ['title']
	ordering_fields = ['started_at', 'created_at']

	def get_queryset(self):
		return FocusSession.objects.filter(user=self.request.user)

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)
