from rest_framework import serializers

from .models import LearningLog


class LearningLogSerializer(serializers.ModelSerializer):
	class Meta:
		model = LearningLog
		fields = ['id', 'topic', 'duration_minutes', 'logged_at', 'created_at']
		read_only_fields = ['id', 'created_at']
