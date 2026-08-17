from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST


@csrf_exempt
@require_POST
def frontdesk_api_login(request):

    import json

    try:
        data = json.loads(request.body)

    except json.JSONDecodeError:

        return JsonResponse(
            {
                "success": False,
                "message": "Invalid request data."
            },
            status=400
        )

    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username or not password:

        return JsonResponse(
            {
                "success": False,
                "message": "Username and password are required."
            },
            status=400
        )

    user = authenticate(
        request,
        username=username,
        password=password
    )

    if user is None:

        return JsonResponse(
            {
                "success": False,
                "message": "Invalid username or password."
            },
            status=401
        )

    # -----------------------------------------
    # Check Employee account
    # -----------------------------------------

    if not hasattr(user, "employee"):

        return JsonResponse(
            {
                "success": False,
                "message": "This account is not an employee account."
            },
            status=403
        )

    employee = user.employee

    # -----------------------------------------
    # Check Employee status
    # -----------------------------------------

    if employee.status != "active":

        return JsonResponse(
            {
                "success": False,
                "message": "Your employee account is inactive."
            },
            status=403
        )

    # -----------------------------------------
    # Login user
    # -----------------------------------------

    login(request, user)

    hotel = employee.hotel

    return JsonResponse(
        {
            "success": True,

            "message": "Login successful.",

            "employee": {
                "id": employee.id,
                "employee_id": employee.employee_id,
                "first_name": employee.first_name,
                "last_name": employee.last_name,
                "name": (
                    f"{employee.first_name} "
                    f"{employee.last_name}"
                ).strip(),
                "username": user.username,
                "designation": employee.designation,
                "department": employee.get_department_display(),
            },

            "hotel": {
                "id": hotel.id,
                "name": hotel.name,
                "code": hotel.code,
                "city": hotel.city,
            }
        }
    )

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


def frontdesk_login(request):

    if request.user.is_authenticated:

        if hasattr(request.user, "employee"):
            return redirect("frontdesk-dashboard")

        return redirect("dashboard")

    if request.method == "POST":

        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is not None:

            # ------------------------------------------
            # Check employee account
            # ------------------------------------------

            if not hasattr(user, "employee"):

                messages.error(
                    request,
                    "This account is not a Front Desk employee account."
                )

                return render(
                    request,
                    "accounts/frontdesk_login.html"
                )

            employee = user.employee

            # ------------------------------------------
            # Check employee status
            # ------------------------------------------

            if employee.status != "active":

                messages.error(
                    request,
                    "Your employee account is currently inactive."
                )

                return render(
                    request,
                    "accounts/frontdesk_login.html"
                )

            # ------------------------------------------
            # Login
            # ------------------------------------------

            login(request, user)

            return redirect(
                "frontdesk-dashboard"
            )

        messages.error(
            request,
            "Invalid username or password."
        )

    return render(
        request,
        "accounts/frontdesk_login.html"
    )


@login_required
def frontdesk_logout(request):

    logout(request)

    return redirect(
        "frontdesk-login"
    )