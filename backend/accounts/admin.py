from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (("Rôle SecureTrack", {"fields": ("role",)}),)
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Informations", {"fields": ("email", "first_name", "role")}),
    )
    list_display = ("username", "email", "first_name", "role", "is_active")
    list_filter = ("role", "is_active")
