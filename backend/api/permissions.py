from rest_framework.permissions import BasePermission

from .models import Zaposleni


class JeMenadzerIliAdmin(BasePermission):
    message = 'Potrebna su ovlašćenja menadžera ili administratora.'

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and user.uloga in (Zaposleni.Uloga.MENADZER, Zaposleni.Uloga.ADMIN)
        )


class JeAdmin(BasePermission):
    message = 'Potrebna su ovlašćenja administratora.'

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.uloga == Zaposleni.Uloga.ADMIN)
