from functools import wraps

from django.contrib.auth import logout
from django.shortcuts import redirect


def admin_required(view_func):

    @wraps(view_func)
    def wrapper(request, *args, **kwargs):

        if not request.user.is_authenticated:
            return redirect("accounts:login")

        # Employee accounts cannot access Admin
        if hasattr(request.user, "employee"):
            logout(request)

            return redirect("accounts:frontdesk-login")

        # No profile = not an admin
        if not hasattr(request.user, "profile"):
            logout(request)

            return redirect("accounts:login")

        # Only admin role
        if request.user.profile.role != "admin":

            logout(request)

            return redirect("accounts:login")

        return view_func(
            request,
            *args,
            **kwargs
        )

    return wrapper