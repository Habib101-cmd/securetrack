from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "admin", "Administrateur"
        ANALYSTE = "analyste", "Analyste sécurité"
        TECHNICIEN = "technicien", "Technicien"

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.TECHNICIEN)

    def __str__(self):
        return f"{self.first_name or self.username} ({self.role})"
