from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Assignment, Subject
from .serializers import AssignmentSerializer, SubjectSerializer


class SubjectViewSet(viewsets.ModelViewSet):
	serializer_class = SubjectSerializer
	permission_classes = [IsAuthenticated]
	filterset_fields = ['name']
	search_fields = ['name']
	ordering_fields = ['name', 'created_at']

	def get_queryset(self):
		return Subject.objects.filter(user=self.request.user)

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)


class AssignmentViewSet(viewsets.ModelViewSet):
	serializer_class = AssignmentSerializer
	permission_classes = [IsAuthenticated]
	filterset_fields = ['status', 'priority', 'subject']
	search_fields = ['title', 'description']
	ordering_fields = ['due_date', 'created_at', 'updated_at']

	def get_queryset(self):
		return Assignment.objects.filter(user=self.request.user)

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)
