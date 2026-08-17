from django.urls import path

from . import views


urlpatterns = [

    # Employee list
    path(
        "",
        views.employee_list,
        name="employee-list"
    ),

    # Add employee
    path(
        "add/",
        views.add_employee,
        name="add-employee"
    ),

 

    # Roles
    path(
        "roles/",
        views.role_list,
        name="role-list"
    ),

    path(
        "roles/add/",
        views.add_role,
        name="add-role"
    ),

       # View employee
        path(
            "<int:pk>/",
            views.employee_detail,
            name="employee-detail"
        ),
    
        # Delete employee
        path(
            "<int:pk>/delete/",
            views.delete_employee,
            name="delete-employee"
        ),

        # Reset password
    path(
        "<int:pk>/reset-password/",
        views.reset_employee_password,
        name="reset-employee-password"
    ),
]