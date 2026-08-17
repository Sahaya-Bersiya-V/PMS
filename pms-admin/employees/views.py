from django.contrib import messages
from django.contrib.auth.models import User
from django.db import transaction
from django.shortcuts import get_object_or_404, redirect, render

from hotels.models import Hotel
from .models import Employee


# =========================================================
# EMPLOYEE LIST
# =========================================================

def employee_list(request):

    employees = Employee.objects.select_related(
        "hotel",
        "user"
    ).all()

    search = request.GET.get("search", "").strip()
    department = request.GET.get("department", "")
    status = request.GET.get("status", "")

    if search:

        employees = employees.filter(
            first_name__icontains=search
        ) | employees.filter(
            last_name__icontains=search
        ) | employees.filter(
            employee_id__icontains=search
        ) | employees.filter(
            phone__icontains=search
        ) | employees.filter(
            email__icontains=search
        )

    if department:
        employees = employees.filter(
            department=department
        )

    if status:
        employees = employees.filter(
            status=status
        )

    context = {
        "employees": employees,
        "search": search,
        "department": department,
        "status": status,
        "department_choices": Employee.DEPARTMENT_CHOICES,
        "status_choices": Employee.EMPLOYMENT_STATUS_CHOICES,
    }

    return render(
        request,
        "employees/employee_list.html",
        context
    )


# =========================================================
# ADD EMPLOYEE
# =========================================================

@transaction.atomic
def add_employee(request):

    hotels = Hotel.objects.filter(
        status="active"
    ).order_by("name")

    if request.method == "POST":

        first_name = request.POST.get(
            "first_name",
            ""
        ).strip()

        last_name = request.POST.get(
            "last_name",
            ""
        ).strip()

        phone = request.POST.get(
            "phone",
            ""
        ).strip()

        email = request.POST.get(
            "email",
            ""
        ).strip()

        address = request.POST.get(
            "address",
            ""
        ).strip()

        hotel_id = request.POST.get("hotel")

        department = request.POST.get(
            "department"
        )

        designation = request.POST.get(
            "designation",
            ""
        ).strip()

        joining_date = request.POST.get(
            "joining_date"
        )

        salary = request.POST.get(
            "salary",
            ""
        ).strip()

        status = request.POST.get(
            "status"
        ) or "active"

        username = request.POST.get(
            "username",
            ""
        ).strip()

        password = request.POST.get(
            "password",
            ""
        )

        confirm_password = request.POST.get(
            "confirm_password",
            ""
        )

        # -------------------------------------------------
        # VALIDATION
        # -------------------------------------------------

        if not first_name:

            messages.error(
                request,
                "First name is required."
            )

            return render(
                request,
                "employees/add_employee.html",
                {
                    "hotels": hotels,
                    "department_choices":
                        Employee.DEPARTMENT_CHOICES,
                    "status_choices":
                        Employee.EMPLOYMENT_STATUS_CHOICES,
                }
            )

        if not hotel_id:

            messages.error(
                request,
                "Please select a hotel."
            )

            return render(
                request,
                "employees/add_employee.html",
                {
                    "hotels": hotels,
                    "department_choices":
                        Employee.DEPARTMENT_CHOICES,
                    "status_choices":
                        Employee.EMPLOYMENT_STATUS_CHOICES,
                }
            )

        if not username:

            messages.error(
                request,
                "Username is required."
            )

            return render(
                request,
                "employees/add_employee.html",
                {
                    "hotels": hotels,
                    "department_choices":
                        Employee.DEPARTMENT_CHOICES,
                    "status_choices":
                        Employee.EMPLOYMENT_STATUS_CHOICES,
                }
            )

        if not password:

            messages.error(
                request,
                "Password is required."
            )

            return render(
                request,
                "employees/add_employee.html",
                {
                    "hotels": hotels,
                    "department_choices":
                        Employee.DEPARTMENT_CHOICES,
                    "status_choices":
                        Employee.EMPLOYMENT_STATUS_CHOICES,
                }
            )

        if password != confirm_password:

            messages.error(
                request,
                "Password and confirm password do not match."
            )

            return render(
                request,
                "employees/add_employee.html",
                {
                    "hotels": hotels,
                    "department_choices":
                        Employee.DEPARTMENT_CHOICES,
                    "status_choices":
                        Employee.EMPLOYMENT_STATUS_CHOICES,
                }
            )

        # -------------------------------------------------
        # USERNAME CHECK
        # -------------------------------------------------

        if User.objects.filter(
            username=username
        ).exists():

            messages.error(
                request,
                "This username already exists."
            )

            return render(
                request,
                "employees/add_employee.html",
                {
                    "hotels": hotels,
                    "department_choices":
                        Employee.DEPARTMENT_CHOICES,
                    "status_choices":
                        Employee.EMPLOYMENT_STATUS_CHOICES,
                }
            )

        # -------------------------------------------------
        # HOTEL
        # -------------------------------------------------

        hotel = get_object_or_404(
            Hotel,
            id=hotel_id,
            status="active"
        )

        # -------------------------------------------------
        # EMPLOYEE ID
        # -------------------------------------------------

        last_employee = (
            Employee.objects
            .order_by("-id")
            .first()
        )

        if last_employee:

            try:

                last_number = int(
                    last_employee.employee_id
                    .replace("EMP", "")
                )

            except (
                ValueError,
                AttributeError
            ):

                last_number = last_employee.id

            next_number = last_number + 1

        else:

            next_number = 1

        employee_id = f"EMP{next_number:03d}"

        # -------------------------------------------------
        # CREATE USER
        # -------------------------------------------------

        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            email=email
        )

        user.is_staff = False
        user.is_superuser = False
        user.save()

        # -------------------------------------------------
        # CREATE EMPLOYEE
        # -------------------------------------------------

        Employee.objects.create(
            hotel=hotel,
            user=user,
            employee_id=employee_id,

            first_name=first_name,
            last_name=last_name,

            phone=phone,
            email=email,

            department=department,
            designation=designation,

            joining_date=joining_date,

            salary=salary if salary else None,

            status=status,

            address=address
        )

        messages.success(
            request,
            f"Employee {employee_id} created successfully."
        )

        return redirect(
            "employee-list"
        )

    context = {
        "hotels": hotels,
        "department_choices":
            Employee.DEPARTMENT_CHOICES,
        "status_choices":
            Employee.EMPLOYMENT_STATUS_CHOICES,
    }

    return render(
        request,
        "employees/add_employee.html",
        context
    )


# =========================================================
# VIEW EMPLOYEE
# =========================================================

def employee_detail(request, pk):

    employee = get_object_or_404(
        Employee.objects.select_related(
            "hotel",
            "user"
        ),
        pk=pk
    )

    return render(
        request,
        "employees/employee_detail.html",
        {
            "employee": employee
        }
    )


# =========================================================
# DELETE EMPLOYEE
# =========================================================

@transaction.atomic
def delete_employee(request, pk):

    employee = get_object_or_404(
        Employee.objects.select_related("user"),
        pk=pk
    )

    if request.method == "POST":

        employee_name = (
            f"{employee.first_name} "
            f"{employee.last_name}"
        ).strip()

        user = employee.user

        employee.delete()

        if user:
            user.delete()

        messages.success(
            request,
            f"{employee_name} deleted successfully."
        )

    return redirect(
        "employee-list"
    )


# =========================================================
# ROLE LIST
# =========================================================

def role_list(request):

    return render(
        request,
        "employees/role_list.html"
    )


# =========================================================
# ADD ROLE
# =========================================================

def add_role(request):

    return render(
        request,
        "employees/add_role.html"
    )

# =========================================================
# RESET EMPLOYEE PASSWORD
# =========================================================

@transaction.atomic
def reset_employee_password(request, pk):

    employee = get_object_or_404(
        Employee.objects.select_related("user"),
        pk=pk
    )

    # Employee must have a login account
    if not employee.user:

        messages.error(
            request,
            "This employee does not have a login account."
        )

        return redirect(
            "employee-detail",
            pk=employee.pk
        )

    if request.method == "POST":

        password = request.POST.get(
            "password",
            ""
        )

        confirm_password = request.POST.get(
            "confirm_password",
            ""
        )

        # -----------------------------
        # Validation
        # -----------------------------

        if not password:

            messages.error(
                request,
                "Password is required."
            )

            return render(
                request,
                "employees/reset_password.html",
                {
                    "employee": employee
                }
            )

        if len(password) < 8:

            messages.error(
                request,
                "Password must contain at least 8 characters."
            )

            return render(
                request,
                "employees/reset_password.html",
                {
                    "employee": employee
                }
            )

        if password != confirm_password:

            messages.error(
                request,
                "Passwords do not match."
            )

            return render(
                request,
                "employees/reset_password.html",
                {
                    "employee": employee
                }
            )

        # -----------------------------
        # Change password
        # -----------------------------

        employee.user.set_password(
            password
        )

        employee.user.save()

        messages.success(
            request,
            f"Password reset successfully for {employee.first_name}."
        )

        return redirect(
            "employee-detail",
            pk=employee.pk
        )

    return render(
        request,
        "employees/reset_password.html",
        {
            "employee": employee
        }
    )