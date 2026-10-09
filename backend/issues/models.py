from django.conf import settings
from django.db import models


class Issue(models.Model):
    class Urgency(models.TextChoices):
        FAIBLE = "faible", "Faible"
        MOYENNE = "moyenne", "Moyenne"
        ELEVEE = "elevee", "Élevée"

    class Status(models.TextChoices):
        A_TRAITER = "a_traiter", "À traiter"
        EN_COURS = "en_cours", "En cours"
        CORRIGE = "corrige", "Corrigé"
        REJETE = "rejete", "Rejeté / Faux positif"

    title = models.CharField(max_length=100)
    description = models.TextField(max_length=1000)
    device = models.CharField(max_length=100)
    urgency = models.CharField(max_length=10, choices=Urgency.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.A_TRAITER)
    assignee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT,
                                 related_name="assigned_issues")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT,
                               related_name="created_issues")
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Comment(models.Model):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    content = models.TextField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]


class IssueHistory(models.Model):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name="history")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    field = models.CharField(max_length=50)
    old_value = models.TextField(blank=True)
    new_value = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "issue histories"
