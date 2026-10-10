from rest_framework.permissions import BasePermission


class IssuePermission(BasePermission):
    def has_permission(self, request, view):
        role = request.user.role
        if view.action == "create":
            return role in ("analyste", "admin")
        if view.action == "destroy":
            return role == "admin"
        return True

    def has_object_permission(self, request, view, obj):
        if request.user.role == "technicien":
            return obj.assignee_id == request.user.id
        return True
