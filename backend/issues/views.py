from django.db.models import Count
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Issue, IssueHistory
from .permissions import IssuePermission
from .serializers import CommentSerializer, IssueSerializer


class IssueViewSet(viewsets.ModelViewSet):
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated, IssuePermission]
    http_method_names = ["get", "post", "patch", "delete"]

    def get_queryset(self):
        qs = Issue.objects.select_related("assignee", "author")
        user = self.request.user

        # Filtrage côté serveur : un technicien ne voit que ses problèmes
        if user.role == "technicien":
            qs = qs.filter(assignee=user)

        p = self.request.query_params
        if p.get("urgency"):
            qs = qs.filter(urgency=p["urgency"])
        if p.get("status"):
            qs = qs.filter(status=p["status"])
        if p.get("device"):
            qs = qs.filter(device__icontains=p["device"])
        if p.get("q"):
            qs = qs.filter(title__icontains=p["q"])
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        user = self.request.user
        data = serializer.validated_data

        if user.role == "technicien":
            if set(data) - {"status"}:
                raise PermissionDenied("Un technicien ne peut modifier que l'état.")
            if data.get("status") == Issue.Status.REJETE:
                raise PermissionDenied("Seul un analyste peut rejeter un problème.")

        old = {f: str(getattr(serializer.instance, f)) for f in data}
        issue = serializer.save()

        for field, old_value in old.items():
            new_value = str(getattr(issue, field))
            if old_value != new_value:
                IssueHistory.objects.create(
                    issue=issue, user=user, field=field,
                    old_value=old_value, new_value=new_value,
                )

    @action(detail=True, methods=["post"])
    def comments(self, request, pk=None):
        issue = self.get_object()          # vérifie aussi les droits sur l'objet
        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(issue=issue, author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["get"])
    def stats(self, request):
        rows = self.get_queryset().values("status").annotate(total=Count("id"))
        result = {"a_traiter": 0, "en_cours": 0, "corrige": 0, "rejete": 0}
        result.update({r["status"]: r["total"] for r in rows})
        return Response(result)
