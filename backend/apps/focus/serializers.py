from rest_framework import serializers

from .models import FocusSession


class FocusSessionSerializer(serializers.ModelSerializer):
	class Meta:
		model = FocusSession
		fields = ['id', 'title', 'planned_duration', 'started_at', 'created_at']
		read_only_fields = ['id', 'started_at', 'created_at']
