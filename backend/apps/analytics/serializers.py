from rest_framework import serializers

from .models import DailySummary


class DailySummarySerializer(serializers.ModelSerializer):
	class Meta:
		model = DailySummary
		fields = ['id', 'date', 'total_focus_minutes', 'productivity_score', 'created_at']
		read_only_fields = ['id', 'created_at']
