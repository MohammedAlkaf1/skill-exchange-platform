from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        if not username:
            raise ValueError('Username is required')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, username, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    AVAILABILITY_CHOICES = [
        ('available', 'Available'),
        ('busy', 'Busy'),
        ('weekends_only', 'Weekends Only'),
    ]

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, unique=True)
    full_name = models.CharField(max_length=150)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    availability = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES, default='available')

    reputation_score = models.FloatField(default=0)
    average_rating = models.FloatField(default=0)
    completed_exchanges_count = models.PositiveIntegerField(default=0)
    reviews_count = models.PositiveIntegerField(default=0)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'full_name']

    class Meta:
        db_table = 'users'
        ordering = ['-reputation_score']

    def __str__(self):
        return f'{self.username} ({self.email})'

    def get_reputation_level(self):
        score = self.reputation_score
        if score < 50:
            return 'New Member'
        elif score < 150:
            return 'Trusted Member'
        elif score < 300:
            return 'Highly Rated Member'
        return 'Expert Contributor'

    def recalculate_reputation(self):
        from apps.reviews.models import Review
        reviews = Review.objects.filter(reviewed_user=self)
        count = reviews.count()
        if count > 0:
            total_rating = sum(r.rating for r in reviews)
            self.average_rating = round(total_rating / count, 2)
            positive = reviews.filter(rating__gte=4).count()
        else:
            self.average_rating = 0
            positive = 0
        self.reviews_count = count
        self.reputation_score = round(
            self.completed_exchanges_count * 10 +
            self.average_rating * 20 +
            positive * 5,
            2
        )
        self.save(update_fields=['average_rating', 'reviews_count', 'reputation_score'])
