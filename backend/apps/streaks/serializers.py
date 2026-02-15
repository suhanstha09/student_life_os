from rest_framework import serializers

from .models import Streak


class StreakSerializer(serializers.ModelSerializer):
	class Meta:
		model = Streak
		fields = ['id', 'streak_type', 'current_count', 'last_activity_date', 'created_at']
		read_only_fields = ['id', 'created_at']
