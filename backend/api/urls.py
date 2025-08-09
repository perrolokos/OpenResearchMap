from django.urls import path
from . import views

urlpatterns = [
    path("search", views.search),
    path("export/mermaid", views.export_mermaid),
]

