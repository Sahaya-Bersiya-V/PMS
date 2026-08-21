from django.urls import path
from . import views


app_name = "accounts"


urlpatterns = [

    # -----------------------------------------
    # Admin authentication
    # -----------------------------------------

    path(
        "login/",
        views.admin_login,
        name="login"
    ),

    path(
        "logout/",
        views.admin_logout,
        name="logout"
    ),

    # -----------------------------------------
    # Admin setup
    # -----------------------------------------

    path(
        "setup/",
        views.admin_setup,
        name="admin-setup"
    ),

    # -----------------------------------------
    # Admin profile
    # -----------------------------------------

    path(
        "profile/",
        views.profile,
        name="profile"
    ),

    path(
    "admin/replace/",
    views.replace_admin,
    name="replace-admin"
),

    path(
        "profile/password/",
        views.change_password,
        name="change-password"
    ),

    path(
        "profile/toggle-status/",
        views.toggle_admin_status,
        name="toggle-admin-status"
    ),

    # -----------------------------------------
    # Front Desk
    # -----------------------------------------

    path(
        "frontdesk/login/",
        views.frontdesk_login,
        name="frontdesk-login"
    ),

    path(
        "frontdesk/logout/",
        views.frontdesk_logout,
        name="frontdesk-logout"
    ),

    path(
        "frontdesk/api/login/",
        views.frontdesk_api_login,
        name="frontdesk-api-login"
    ),
]