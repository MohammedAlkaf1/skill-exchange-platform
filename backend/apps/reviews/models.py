from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Review(models.Model):
    exchange_request = models.ForeignKey(
        'exchanges.ExchangeRequest', on_delete=models.CASCADE, related_name='reviews'
    )
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='given_reviews'
    )
    reviewed_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_reviews'
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    feedback = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reviews'
        unique_together = [['exchange_request', 'reviewer']]
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.reviewer.username} → {self.reviewed_user.username} ({self.rating}/5)'
