# from django.urls import path

# from . import views


# urlpatterns = [

#     # Employee list
#     path(
#         "",
#         views.employee_list,
#         name="employee-list"
#     ),

#     # Add employee
#     path(
#         "add/",
#         views.add_employee,
#         name="add-employee"
#     ),

 

#     # Roles
#     path(
#         "roles/",
#         views.role_list,
#         name="role-list"
#     ),

#     path(
#         "roles/add/",
#         views.add_role,
#         name="add-role"
#     ),

#        # View employee
#         path(
#             "<int:pk>/",
#             views.employee_detail,
#             name="employee-detail"
#         ),
    
#         # Delete employee
#         path(
#             "<int:pk>/delete/",
#             views.delete_employee,
#             name="delete-employee"
#         ),

#         # Reset password
#     path(
#         "<int:pk>/reset-password/",
#         views.reset_employee_password,
#         name="reset-employee-password"
#     ),
# ]


from django.urls import path
from . import views

urlpatterns = [
    # Employee views
    path("", views.employee_list, name="employee-list"),
    path("add/", views.add_employee, name="add-employee"),
    path("<int:pk>/", views.employee_detail, name="employee-detail"),
    path("<int:pk>/delete/", views.delete_employee, name="delete-employee"),
    path("<int:pk>/reset-password/", views.reset_employee_password, name="reset-employee-password"),

    # Role Management
    path("roles/", views.role_list, name="role-list"),
    path("roles/add/", views.add_role, name="add-role"),
    path("roles/<int:pk>/", views.view_role, name="view-role"),
    path("roles/<int:pk>/edit/", views.edit_role, name="edit-role"),
    path("roles/<int:pk>/delete/", views.delete_role, name="delete-role"),
]