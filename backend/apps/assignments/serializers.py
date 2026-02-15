from rest_framework import serializers

from .models import Assignment, Subject


class SubjectSerializer(serializers.ModelSerializer):
	class Meta:
		model = Subject
		fields = ['id', 'name', 'color', 'created_at', 'updated_at']
		read_only_fields = ['id', 'created_at', 'updated_at']


class AssignmentSerializer(serializers.ModelSerializer):
	subject_detail = SubjectSerializer(source='subject', read_only=True)

	class Meta:
		model = Assignment
		fields = [
			'id',
			'subject',
			'subject_detail',
			'title',
			'description',
			'due_date',
			'status',
			'priority',
			'estimated_duration',
			'completed_at',
			'created_at',
			'updated_at',
		]
		read_only_fields = ['id', 'completed_at', 'created_at', 'updated_at']
