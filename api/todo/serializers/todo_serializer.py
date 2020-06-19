from rest_framework import serializers
from todo.models.todo_model import TodoModel


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoModel
        fields = [
            "id",
            "title",
            "due_date_time",
            "is_completed",
            "completed_at",
            "deleted",
        ]
