from django.urls import path
from . import views

urlpatterns = [

    path("", views.employee_list, name="employee-list"),

    path("add/", views.add_employee, name="add-employee"),

    path("roles/", views.role_list, name="role-list"),

    path("roles/add/", views.add_role, name="add-role"),

]