from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth.models import User
from django.contrib.auth import update_session_auth_hash
from django.db import transaction
from django.utils.crypto import get_random_string
from .models import UserProfile


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

    username = data.get(
        "username",
        ""
    ).strip()

    password = data.get(
        "password",
        ""
    )

    if not username or not password:

        return JsonResponse(
            {
                "success": False,
                "message": "Username and password are required."
            },
            status=400
        )

    # ==========================================
    # AUTHENTICATE
    # ==========================================

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

    # ==========================================
    # MUST BE EMPLOYEE
    # ==========================================

    if not hasattr(user, "employee"):

        return JsonResponse(
            {
                "success": False,
                "message": "This account is not a Front Desk employee account."
            },
            status=403
        )

    employee = user.employee

    # ==========================================
    # EMPLOYEE STATUS
    # ==========================================

    if employee.status != "active":

        return JsonResponse(
            {
                "success": False,
                "message": "Your employee account is inactive."
            },
            status=403
        )

    # ==========================================
    # CHECK ROLE
    # ==========================================

    if not employee.role:

        return JsonResponse(
            {
                "success": False,
                "message": "No role has been assigned to this employee."
            },
            status=403
        )

    role_name = employee.role.name.strip().lower()

    # Accept:
    # Frontdesk
    # Front Desk
    # front_desk

    normalized_role = (
        role_name
        .replace("_", "")
        .replace("-", "")
        .replace(" ", "")
    )

    if normalized_role != "frontdesk":

        return JsonResponse(
            {
                "success": False,
                "message": "This employee is not authorized to access the Front Desk."
            },
            status=403
        )

    # ==========================================
    # LOGIN
    # ==========================================

    login(
        request,
        user
    )

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
                "role": employee.role.name,
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

        # Already logged-in employee
        if hasattr(request.user, "employee"):
            return redirect("accounts:frontdesk-login")

        # Already logged-in admin
        if (
            hasattr(request.user, "profile")
            and request.user.profile.role == "admin"
        ):
            return redirect("dashboard")

        logout(request)

    if request.method == "POST":

        username = request.POST.get(
            "username",
            ""
        ).strip()

        password = request.POST.get(
            "password",
            ""
        )

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is None:

            messages.error(
                request,
                "Invalid username or password."
            )

            return render(
                request,
                "registration/login.html"
            )

        # ==========================================
        # BLOCK EMPLOYEE ACCOUNTS
        # ==========================================

        if hasattr(user, "employee"):

            messages.error(
                request,
                "Employee accounts cannot access the PMS Admin."
            )

            return render(
                request,
                "registration/login.html"
            )

        # ==========================================
        # CHECK ADMIN PROFILE
        # ==========================================

        if not hasattr(user, "profile"):

            messages.error(
                request,
                "This account is not authorized to access the PMS Admin."
            )

            return render(
                request,
                "registration/login.html"
            )

        # ==========================================
        # ADMIN ONLY
        # ==========================================

        if user.profile.role != "admin":

            messages.error(
                request,
                "You do not have administrator access."
            )

            return render(
                request,
                "registration/login.html"
            )

        # ==========================================
        # LOGIN ADMIN
        # ==========================================

        login(request, user)

        return redirect("dashboard")

    return render(
        request,
        "registration/login.html"
    )


def admin_logout(request):

    logout(request)

    return redirect("accounts:login")


@login_required
def profile(request):

    user = request.user

    print("================================")
    print("PROFILE VIEW CALLED")
    print("Username:", user.username)
    print("User ID:", user.id)
    print("Authenticated:", user.is_authenticated)
    print("Has profile:", hasattr(user, "profile"))

    if not hasattr(user, "profile"):
        print("❌ NO PROFILE")
        return redirect("dashboard")

    profile = user.profile

    print("Profile role:", profile.role)
    print("Is active:", user.is_active)

    if profile.role != "admin":
        print("❌ NOT ADMIN - REDIRECTING")
        return redirect("dashboard")

    print("✅ ADMIN - OPENING PROFILE")

    if request.method == "POST":

        user.first_name = request.POST.get(
            "first_name",
            ""
        ).strip()

        user.last_name = request.POST.get(
            "last_name",
            ""
        ).strip()

        user.email = request.POST.get(
            "email",
            ""
        ).strip()

        profile.phone = request.POST.get(
            "phone",
            ""
        ).strip()

        profile.address = request.POST.get(
            "address",
            ""
        ).strip()

        profile.city = request.POST.get(
            "city",
            ""
        ).strip()

        profile.state = request.POST.get(
            "state",
            ""
        ).strip()

        profile.pincode = request.POST.get(
            "pincode",
            ""
        ).strip()

        user.save()
        profile.save()

        messages.success(
            request,
            "Profile updated successfully."
        )

        return redirect("accounts:profile")

    context = {
        "profile": profile,
        "user": user,
        "is_active": user.is_active,
        "avatar": (
            f"{user.first_name[:1]}"
            f"{user.last_name[:1]}"
        ).upper(),
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

def generate_admin_username(first_name, last_name):

    base = (
        f"{first_name}.{last_name}"
        .lower()
        .replace(" ", "")
    )

    username = base
    counter = 1

    while User.objects.filter(
        username=username
    ).exists():

        username = f"{base}{counter}"
        counter += 1

    return username

def generate_admin_password():

    return (
        get_random_string(
            4,
            allowed_chars="ABCDEFGHJKLMNPQRSTUVWXYZ"
        )
        +
        get_random_string(
            4,
            allowed_chars="abcdefghijkmnopqrstuvwxyz"
        )
        +
        get_random_string(
            2,
            allowed_chars="23456789"
        )
        +
        "@#"
    )

def admin_setup(request):

    # -----------------------------------------
    # Check whether an admin already exists
    # -----------------------------------------

    admin_exists = User.objects.filter(
    profile__role="admin",
    is_active=True
).exists()

    if admin_exists:
        return redirect("accounts:profile")

    # -----------------------------------------
    # POST
    # -----------------------------------------

    if request.method == "POST":

        first_name = request.POST.get(
            "first_name",
            ""
        ).strip()

        last_name = request.POST.get(
            "last_name",
            ""
        ).strip()

        email = request.POST.get(
            "email",
            ""
        ).strip()

        phone = request.POST.get(
            "phone",
            ""
        ).strip()

        address = request.POST.get(
            "address",
            ""
        ).strip()

        city = request.POST.get(
            "city",
            ""
        ).strip()

        state = request.POST.get(
            "state",
            ""
        ).strip()

        pincode = request.POST.get(
            "pincode",
            ""
        ).strip()

        # -----------------------------------------
        # Validation
        # -----------------------------------------

        if not first_name or not email:

            messages.error(
                request,
                "Name and email are required."
            )

            return render(
                request,
                "accounts/admin_setup.html"
            )

        if User.objects.filter(
            email=email
        ).exists():

            messages.error(
                request,
                "An account with this email already exists."
            )

            return render(
                request,
                "accounts/admin_setup.html"
            )

        # -----------------------------------------
        # Generate credentials
        # -----------------------------------------

        username = generate_admin_username(
            first_name,
            last_name
        )

        password = generate_admin_password()

        # -----------------------------------------
        # Create Django user
        # -----------------------------------------

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )

        user.is_active = True
        user.save()

        # -----------------------------------------
        # Create profile
        # -----------------------------------------

        UserProfile.objects.create(
            user=user,
            role="admin",
            phone=phone,
            address=address,
            city=city,
            state=state,
            pincode=pincode,
        )

        # -----------------------------------------
        # Show credentials
        # -----------------------------------------

        return render(
            request,
            "accounts/admin_credentials.html",
            {
                "username": username,
                "password": password,
                "name": (
                    f"{first_name} {last_name}"
                ).strip(),
            }
        )

    return render(
        request,
        "accounts/admin_setup.html"
    )

@login_required
def replace_admin(request):

    # Only an existing admin can replace the administrator
    if not hasattr(request.user, "profile"):
        return redirect("dashboard")

    if request.user.profile.role != "admin":
        messages.error(
            request,
            "Only the administrator can replace the administrator account."
        )
        return redirect("accounts:profile")

    if request.method == "POST":

        first_name = request.POST.get(
            "first_name",
            ""
        ).strip()

        last_name = request.POST.get(
            "last_name",
            ""
        ).strip()

        email = request.POST.get(
            "email",
            ""
        ).strip()

        phone = request.POST.get(
            "phone",
            ""
        ).strip()

        address = request.POST.get(
            "address",
            ""
        ).strip()

        city = request.POST.get(
            "city",
            ""
        ).strip()

        state = request.POST.get(
            "state",
            ""
        ).strip()

        pincode = request.POST.get(
            "pincode",
            ""
        ).strip()

        # -----------------------------------------
        # Basic validation
        # -----------------------------------------

        if not first_name or not email:

            messages.error(
                request,
                "First name and email are required."
            )

            return render(
                request,
                "accounts/admin_replace.html"
            )

        # -----------------------------------------
        # Generate username
        # -----------------------------------------

        username = generate_admin_username(
            first_name,
            last_name
        )

        # -----------------------------------------
        # Generate password
        # -----------------------------------------

        password = generate_admin_password()

        # -----------------------------------------
        # Create new Django user
        # -----------------------------------------

        new_user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        new_user.is_active = True

        new_user.save(
            update_fields=[
                "is_active"
            ]
        )

        # -----------------------------------------
        # Create admin profile
        # -----------------------------------------

        UserProfile.objects.create(
            user=new_user,
            role="admin",
            phone=phone,
            address=address,
            city=city,
            state=state,
            pincode=pincode
        )

        # -----------------------------------------
        # Deactivate old admin
        # -----------------------------------------

        request.user.is_active = False

        request.user.save(
            update_fields=[
                "is_active"
            ]
        )

        # -----------------------------------------
        # Logout old administrator
        # -----------------------------------------

        logout(request)

        # -----------------------------------------
        # Show credentials
        # -----------------------------------------

        return render(
            request,
            "accounts/admin_credentials.html",
            {
                "username": username,
                "password": password,
                "first_name": first_name,
                "last_name": last_name,
            }
        )

    return render(
        request,
        "accounts/admin_replace.html"
    )

@login_required
@require_POST
def change_password(request):

    current_password = request.POST.get(
        "current_password",
        ""
    )

    new_password = request.POST.get(
        "new_password",
        ""
    )

    confirm_password = request.POST.get(
        "confirm_password",
        ""
    )

    user = request.user

    # -----------------------------------------
    # Current password
    # -----------------------------------------

    if not user.check_password(
        current_password
    ):

        messages.error(
            request,
            "Current password is incorrect."
        )

        return redirect(
            "accounts:profile"
        )

    # -----------------------------------------
    # Match
    # -----------------------------------------

    if new_password != confirm_password:

        messages.error(
            request,
            "New passwords do not match."
        )

        return redirect(
            "accounts:profile"
        )

    # -----------------------------------------
    # Minimum validation
    # -----------------------------------------

    if len(new_password) < 8:

        messages.error(
            request,
            "Password must contain at least 8 characters."
        )

        return redirect(
            "accounts:profile"
        )

    # -----------------------------------------
    # Update password
    # -----------------------------------------

    user.set_password(
        new_password
    )

    user.save()

    update_session_auth_hash(
        request,
        user
    )

    messages.success(
        request,
        "Password changed successfully."
    )

    return redirect(
        "accounts:profile"
    )

@login_required
@require_POST
def toggle_admin_status(request):

    user = request.user

    if not hasattr(user, "profile"):

        return redirect("dashboard")

    if user.profile.role != "admin":

        return redirect("dashboard")

    user.is_active = not user.is_active

    user.save(
        update_fields=["is_active"]
    )

    return redirect(
        "accounts:profile"
    )