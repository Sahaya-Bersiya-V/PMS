from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.contrib import messages


def admin_login(request):

    if request.user.is_authenticated:
        return redirect("dashboard")

    if request.method == "POST":

        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is not None:

            login(request, user)

            return redirect("dashboard")

        else:

            messages.error(request, "Invalid username or password")

    return render(request, "registration/login.html")


def admin_logout(request):

    logout(request)

    return redirect("login")


def profile(request):

    profile_data = {
        "first_name": "Admin",
        "last_name": "User",
        "email": "admin@pms.com",
        "phone": "+91 98765 43210",
        "role": "Administrator",
        "department": "Management",
        "employee_id": "EMP001",
        "avatar": "AD",
    }

    context = {
        "profile": profile_data,
    }

    return render(
        request,
        "accounts/profile.html",
        context
    )