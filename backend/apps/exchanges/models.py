from django.db import models
from django.conf import settings


class ExchangeRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_exchanges'
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_exchanges'
    )
    requested_skill = models.ForeignKey(
        'skills.Skill', on_delete=models.SET_NULL, null=True, related_name='requested_in'
    )
    offered_skill = models.ForeignKey(
        'skills.Skill', on_delete=models.SET_NULL, null=True, blank=True, related_name='offered_in'
    )
    message = models.TextField(blank=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'exchange_requests'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.sender.username} → {self.receiver.username} ({self.status})'
