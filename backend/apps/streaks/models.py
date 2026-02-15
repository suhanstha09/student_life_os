from django.db import models
from django.conf import settings

class Streak(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    streak_type = models.CharField(max_length=20)
    current_count = models.IntegerField(default=0)
    last_activity_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'streaks'
        unique_together = [['user', 'streak_type']]
