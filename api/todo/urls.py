from django.urls import path
from .views import TodoView


urlpatterns = [
    path("todo/", TodoView.as_view()),
    path("todo/<int:id>/", TodoView.as_view()),
]

