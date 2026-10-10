from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny, BasePermission
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .models import User
from .serializers import UserSerializer


class IsAnalystOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ("analyste", "admin")


class CsrfView(APIView):
    """Pose le cookie CSRF que React lira ensuite."""
    permission_classes = [AllowAny]

    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        return Response({"detail": "ok"})


class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "login"

    @method_decorator(csrf_protect)
    def post(self, request):
        email = str(request.data.get("email", "")).strip().lower()
        password = str(request.data.get("password", ""))

        found = User.objects.filter(email__iexact=email).first()
        user = authenticate(request, username=found.username, password=password) if found else None

        # Même message dans tous les cas : on ne révèle pas si l'e-mail existe
        if user is None:
            return Response({"error": "Identifiants incorrects"}, status=401)

        login(request, user)
        return Response(UserSerializer(user).data)


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"detail": "Déconnecté"})


class MeView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)


class TechnicianListView(ListAPIView):
    permission_classes = [IsAnalystOrAdmin]
    serializer_class = UserSerializer
    queryset = User.objects.filter(role="technicien")
