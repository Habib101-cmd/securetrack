from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from accounts.views import CsrfView, LoginView, LogoutView, MeView, TechnicianListView
from issues.views import IssueViewSet

router = DefaultRouter()
router.register("issues", IssueViewSet, basename="issue")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/csrf/", CsrfView.as_view()),
    path("api/auth/login/", LoginView.as_view()),
    path("api/auth/logout/", LogoutView.as_view()),
    path("api/auth/me/", MeView.as_view()),
    path("api/technicians/", TechnicianListView.as_view()),
    path("api/", include(router.urls)),
]
