from django.db import models
from django.conf import settings

class LearningLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    topic = models.CharField(max_length=255)
    duration_minutes = models.IntegerField()
    logged_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'learning_logs'
    
    def __str__(self):
        return self.topic
