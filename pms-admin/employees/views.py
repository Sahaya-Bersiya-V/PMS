from django.shortcuts import render


def employee_list(request):

    return render(request,"employees/employee_list.html")


def add_employee(request):

    return render(request,"employees/add_employee.html")


def role_list(request):

    return render(request,"employees/role_list.html")


def add_role(request):

    return render(request,"employees/add_role.html")