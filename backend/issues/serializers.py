from datetime import date

from rest_framework import serializers

from accounts.models import User
from .models import Comment, Issue, IssueHistory


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source="author.first_name", read_only=True)
    content = serializers.CharField(min_length=1, max_length=1000)

    class Meta:
        model = Comment
        fields = ["id", "author", "content", "created_at"]
        read_only_fields = ["id", "author", "created_at"]


class HistorySerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.first_name", read_only=True)

    class Meta:
        model = IssueHistory
        fields = ["id", "user", "field", "old_value", "new_value", "created_at"]


class IssueSerializer(serializers.ModelSerializer):
    assignee = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="technicien")
    )
    assignee_name = serializers.CharField(source="assignee.first_name", read_only=True)
    author_name = serializers.CharField(source="author.first_name", read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    history = HistorySerializer(many=True, read_only=True)

    class Meta:
        model = Issue
        fields = [
            "id", "title", "description", "device", "urgency", "status",
            "assignee", "assignee_name", "author_name", "due_date",
            "created_at", "comments", "history",
        ]
        read_only_fields = ["id", "created_at"]
        extra_kwargs = {
            "title": {"min_length": 3},
            "description": {"min_length": 10},
            "device": {"min_length": 2},
        }

    def validate_due_date(self, value):
        if value and value < date.today():
            raise serializers.ValidationError("L'échéance doit être dans le futur.")
        return value
