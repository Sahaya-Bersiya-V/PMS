from django.contrib import messages
from django.contrib.auth.models import User, Group, Permission
from django.db import transaction
from django.shortcuts import get_object_or_404, redirect, render
from django.db.models import Count
from django.core.paginator import Paginator
from django.utils import timezone

from hotels.models import Hotel
from .models import Employee, RoleExtension

@transaction.atomic
def edit_employee(request, employee_id):

    employee = get_object_or_404(
        Employee.objects.select_related(
            "user",
            "hotel",
            "role"
        ),
        id=employee_id
    )

    hotels = Hotel.objects.filter(
        status="active"
    ).order_by("name")

    department_choices = Employee.DEPARTMENT_CHOICES
    status_choices = Employee.EMPLOYMENT_STATUS_CHOICES

    if request.method == "POST":

        # =====================================================
        # PERSONAL INFORMATION
        # =====================================================

        employee.first_name = request.POST.get(
            "first_name",
            ""
        ).strip()

        employee.last_name = request.POST.get(
            "last_name",
            ""
        ).strip()

        employee.phone = request.POST.get(
            "phone",
            ""
        ).strip()

        employee.email = request.POST.get(
            "email",
            ""
        ).strip()

        employee.address = request.POST.get(
            "address",
            ""
        ).strip()


        # =====================================================
        # EMPLOYMENT INFORMATION
        # =====================================================

        hotel_id = request.POST.get("hotel")

        if hotel_id:
            employee.hotel = get_object_or_404(
                Hotel,
                id=hotel_id,
                status="active"
            )

        employee.department = request.POST.get(
            "department",
            employee.department
        )

        employee.designation = request.POST.get(
            "designation",
            employee.designation
        )

        # -----------------------------------------------------
        # JOINING DATE
        # Keep existing date if nothing is submitted
        # -----------------------------------------------------

        joining_date = request.POST.get(
            "joining_date",
            ""
        ).strip()

        if joining_date:
            employee.joining_date = joining_date

        # If joining_date is empty:
        # DO NOT overwrite the existing date.


        # =====================================================
        # SALARY
        # =====================================================

        salary = request.POST.get(
            "salary",
            ""
        ).strip()

        employee.salary = salary if salary else None


        # =====================================================
        # STATUS
        # =====================================================

        status = request.POST.get("status")

        if status:
            employee.status = status


        # =====================================================
        # USER ACCOUNT
        # =====================================================

        if employee.user:

            username = request.POST.get(
                "username",
                ""
            ).strip()

            if not username:

                messages.error(
                    request,
                    "Username is required."
                )

                return render(
                    request,
                    "employees/add_employee.html",
                    {
                        "employee": employee,
                        "hotels": hotels,
                        "department_choices":
                            department_choices,
                        "status_choices":
                            status_choices,
                        "is_edit": True,
                    }
                )


            # -------------------------------------------------
            # USERNAME DUPLICATE CHECK
            # -------------------------------------------------

            username_exists = User.objects.filter(
                username=username
            ).exclude(
                id=employee.user.id
            ).exists()

            if username_exists:

                messages.error(
                    request,
                    "This username is already in use."
                )

                return render(
                    request,
                    "employees/add_employee.html",
                    {
                        "employee": employee,
                        "hotels": hotels,
                        "department_choices":
                            department_choices,
                        "status_choices":
                            status_choices,
                        "is_edit": True,
                    }
                )


            # -------------------------------------------------
            # UPDATE USER INFORMATION
            # -------------------------------------------------

            employee.user.username = username

            employee.user.email = employee.email

            employee.user.first_name = employee.first_name

            employee.user.last_name = employee.last_name


            # =================================================
            # PASSWORD
            # =================================================

            password = request.POST.get(
                "password",
                ""
            ).strip()

            confirm_password = request.POST.get(
                "confirm_password",
                ""
            ).strip()


            # -------------------------------------------------
            # BOTH EMPTY = KEEP CURRENT PASSWORD
            # -------------------------------------------------

            if not password and not confirm_password:

                # Do absolutely nothing.
                # Existing password remains unchanged.

                pass


            # -------------------------------------------------
            # ONLY ONE FIELD FILLED
            # -------------------------------------------------

            elif not password or not confirm_password:

                messages.error(
                    request,
                    "Please enter and confirm the new password."
                )

                return render(
                    request,
                    "employees/add_employee.html",
                    {
                        "employee": employee,
                        "hotels": hotels,
                        "department_choices":
                            department_choices,
                        "status_choices":
                            status_choices,
                        "is_edit": True,
                    }
                )


            # -------------------------------------------------
            # BOTH FILLED BUT DIFFERENT
            # -------------------------------------------------

            elif password != confirm_password:

                messages.error(
                    request,
                    "Password and confirm password do not match."
                )

                return render(
                    request,
                    "employees/add_employee.html",
                    {
                        "employee": employee,
                        "hotels": hotels,
                        "department_choices":
                            department_choices,
                        "status_choices":
                            status_choices,
                        "is_edit": True,
                    }
                )


            # -------------------------------------------------
            # NEW PASSWORD
            # -------------------------------------------------

            else:

                if len(password) < 8:

                    messages.error(
                        request,
                        "Password must contain at least 8 characters."
                    )

                    return render(
                        request,
                        "employees/add_employee.html",
                        {
                            "employee": employee,
                            "hotels": hotels,
                            "department_choices":
                                department_choices,
                            "status_choices":
                                status_choices,
                            "is_edit": True,
                        }
                    )

                employee.user.set_password(
                    password
                )


            employee.user.save()


        # =====================================================
        # SAVE EMPLOYEE
        # =====================================================

        employee.save()


        messages.success(
            request,
            f"{employee.first_name} {employee.last_name} "
            "updated successfully."
        )

        return redirect(
            "employee-list"
        )


    # =========================================================
    # GET REQUEST
    # =========================================================

    return render(
        request,
        "employees/add_employee.html",
        {
            "employee": employee,
            "hotels": hotels,
            "department_choices":
                department_choices,
            "status_choices":
                status_choices,
            "is_edit": True,
        }
    )
# =========================================================
# EMPLOYEE LIST
# =========================================================

def employee_list(request):

    # =====================================================
    # BASE QUERY
    # =====================================================

    employees = Employee.objects.select_related(
        "hotel",
        "user",
        "role"
    ).order_by(
        "first_name",
        "last_name"
    )


    # =====================================================
    # FILTERS
    # =====================================================

    search = request.GET.get(
        "search",
        ""
    ).strip()

    department = request.GET.get(
        "department",
        ""
    )

    status = request.GET.get(
        "status",
        ""
    )

    selected_hotel = request.GET.get(
        "hotel",
        ""
    )


    # =====================================================
    # SEARCH
    # =====================================================

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


    # =====================================================
    # DEPARTMENT
    # =====================================================

    if department:

        employees = employees.filter(
            department=department
        )


    # =====================================================
    # STATUS
    # =====================================================

    if status:

        employees = employees.filter(
            status=status
        )


    # =====================================================
    # HOTEL
    # =====================================================

    if selected_hotel:

        employees = employees.filter(
            hotel_id=selected_hotel
        )


    # =====================================================
    # SUMMARY CARDS
    # =====================================================

    total_employees = employees.count()

    active_employees = employees.filter(
        status="active"
    ).count()

    inactive_employees = employees.filter(
        status="inactive"
    ).count()

    on_leave_employees = employees.filter(
        status="on_leave"
    ).count()


    total_departments = employees.values(
        "department"
    ).distinct().count()

    total_hotels = employees.values(
        "hotel"
    ).distinct().count()


    # =====================================================
    # NEW EMPLOYEES THIS MONTH
    # =====================================================

    today = timezone.localdate()

    month_start = today.replace(
        day=1
    )

    new_this_month = employees.filter(
        joining_date__gte=month_start,
        joining_date__lte=today
    ).count()


    # =====================================================
    # DEPARTMENT CHART
    # =====================================================

    department_data = list(
        employees
        .values(
            "department"
        )
        .annotate(
            total=Count("id")
        )
        .order_by(
            "-total"
        )
    )


    department_labels = []

    department_values = []


    department_dict = dict(
        Employee.DEPARTMENT_CHOICES
    )


    for item in department_data:

        department_labels.append(
            department_dict.get(
                item["department"],
                item["department"]
            )
        )

        department_values.append(
            item["total"]
        )


    # =====================================================
    # STATUS CHART
    # =====================================================

    status_data = list(
        employees
        .values(
            "status"
        )
        .annotate(
            total=Count("id")
        )
        .order_by(
            "-total"
        )
    )


    status_labels = []

    status_values = []


    status_dict = dict(
        Employee.EMPLOYMENT_STATUS_CHOICES
    )


    for item in status_data:

        status_labels.append(
            status_dict.get(
                item["status"],
                item["status"]
            )
        )

        status_values.append(
            item["total"]
        )


    # =====================================================
    # HOTEL CHART
    # =====================================================

    hotel_data = list(
        employees
        .values(
            "hotel__name"
        )
        .annotate(
            total=Count("id")
        )
        .order_by(
            "-total"
        )
    )


    hotel_labels = [
        item["hotel__name"]
        for item in hotel_data
    ]


    hotel_values = [
        item["total"]
        for item in hotel_data
    ]


    # =====================================================
    # PAGINATION
    # =====================================================

    paginator = Paginator(
        employees,
        5
    )

    page_number = request.GET.get(
        "page"
    )

    page_obj = paginator.get_page(
        page_number
    )

    employees = page_obj.object_list


    # =====================================================
    # CONTEXT
    # =====================================================

    context = {

        # Employees
        "employees": employees,

        # Pagination
        "page_obj": page_obj,
        "paginator": paginator,

        # Filters
        "search": search,
        "department": department,
        "status": status,
        "selected_hotel": selected_hotel,

        "department_choices":
            Employee.DEPARTMENT_CHOICES,

        "status_choices":
            Employee.EMPLOYMENT_STATUS_CHOICES,

        "hotels":
            Hotel.objects.all().order_by("name"),

        # Cards
        "total_employees":
            total_employees,

        "active_employees":
            active_employees,

        "inactive_employees":
            inactive_employees,

        "on_leave_employees":
            on_leave_employees,

        "total_departments":
            total_departments,

        "total_hotels":
            total_hotels,

        "new_this_month":
            new_this_month,

        # Charts
        "department_labels":
            department_labels,

        "department_values":
            department_values,

        "status_labels":
            status_labels,

        "status_values":
            status_values,

        "hotel_labels":
            hotel_labels,

        "hotel_values":
            hotel_values,
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

def role_list(request):
    roles = Group.objects.select_related("extension").annotate(
        employee_count=Count("employees")
    ).all()

    total_roles = roles.count()
    active_roles = sum(1 for r in roles if getattr(r, "extension", None) and r.extension.is_active)
    total_assigned_employees = Employee.objects.filter(role__isnull=False).count()

    context = {
        "roles": roles,
        "total_roles": total_roles,
        "active_roles": active_roles,
        "total_assigned_employees": total_assigned_employees,
    }
    return render(request, "employees/role_list.html", context)


# =========================================================
# ADD ROLE
# =========================================================
@transaction.atomic
def add_role(request):
    permissions = Permission.objects.select_related("content_type").all()
    employees = Employee.objects.all().order_by("first_name")

    if request.method == "POST":
        role_name = request.POST.get("role_name", "").strip()
        status = request.POST.get("status") == "Active"
        description = request.POST.get("description", "").strip()
        selected_permissions = request.POST.getlist("permissions")
        assigned_employee_ids = request.POST.getlist("assigned_employees")

        if not role_name:
            messages.error(request, "Role name is required.")
            return render(request, "employees/add_role.html", {
                "permissions": permissions,
                "employees": employees
            })

        if Group.objects.filter(name=role_name).exists():
            messages.error(request, "A role with this name already exists.")
            return render(request, "employees/add_role.html", {
                "permissions": permissions,
                "employees": employees
            })

        group = Group.objects.create(name=role_name)
        RoleExtension.objects.create(group=group, description=description, is_active=status)

        # Set permissions
        if selected_permissions:
            group.permissions.set(selected_permissions)

        # Assign selected employees to this newly created role
        if assigned_employee_ids:
            Employee.objects.filter(id__in=assigned_employee_ids).update(role=group)

        messages.success(request, f"Role '{role_name}' created successfully.")
        return redirect("role-list")

    context = {
        "permissions": permissions,
        "employees": employees,
    }
    return render(request, "employees/add_role.html", context)


# =========================================================
# EDIT ROLE
# =========================================================
@transaction.atomic
def edit_role(request, pk):
    role = get_object_or_404(Group, pk=pk)
    extension, _ = RoleExtension.objects.get_or_create(group=role)
    permissions = Permission.objects.select_related("content_type").all()
    employees = Employee.objects.all().order_by("first_name")

    if request.method == "POST":
        role_name = request.POST.get("role_name", "").strip()
        status = request.POST.get("status") == "Active"
        description = request.POST.get("description", "").strip()
        selected_permissions = request.POST.getlist("permissions")
        assigned_employee_ids = [int(i) for i in request.POST.getlist("assigned_employees")]

        if not role_name:
            messages.error(request, "Role name is required.")
        else:
            role.name = role_name
            role.save()

            extension.description = description
            extension.is_active = status
            extension.save()

            role.permissions.set(selected_permissions)

            # Clear former role assignments for this group and re-assign
            Employee.objects.filter(role=role).update(role=None)
            if assigned_employee_ids:
                Employee.objects.filter(id__in=assigned_employee_ids).update(role=role)

            messages.success(request, f"Role '{role.name}' updated successfully.")
            return redirect("role-list")

    assigned_emp_ids = list(role.employees.values_list("id", flat=True))
    assigned_perm_ids = list(role.permissions.values_list("id", flat=True))

    context = {
        "role": role,
        "extension": extension,
        "permissions": permissions,
        "employees": employees,
        "assigned_emp_ids": assigned_emp_ids,
        "assigned_perm_ids": assigned_perm_ids,
    }
    return render(request, "employees/edit_role.html", context)


# =========================================================
# VIEW ROLE DETAILS
# =========================================================
def view_role(request, pk):
    role = get_object_or_404(Group.objects.select_related("extension"), pk=pk)
    assigned_employees = role.employees.all()
    permissions = role.permissions.select_related("content_type").all()

    context = {
        "role": role,
        "assigned_employees": assigned_employees,
        "permissions": permissions,
    }
    return render(request, "employees/view_role.html", context)


# =========================================================
# DELETE ROLE
# =========================================================
@transaction.atomic
def delete_role(request, pk):
    role = get_object_or_404(Group, pk=pk)
    if request.method == "POST":
        role_name = role.name
        role.delete()
        messages.success(request, f"Role '{role_name}' deleted successfully.")
    return redirect("role-list")

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