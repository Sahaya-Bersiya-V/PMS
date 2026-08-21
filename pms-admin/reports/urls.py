from django.urls import path
from . import views


app_name = "reports"


urlpatterns = [

    path(
        "",
        views.reports_dashboard,
        name="reports_dashboard"
    ),

    path(
        "export/",
        views.export_reports,
        name="export_reports"
    ),

]