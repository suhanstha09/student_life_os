from django.db import models
from django.conf import settings

class DailySummary(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField()
    total_focus_minutes = models.IntegerField(default=0)
    productivity_score = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'daily_summaries'
        unique_together = [['user', 'date']]
