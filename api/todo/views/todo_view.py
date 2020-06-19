from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from todo.models.todo_model import TodoModel
from todo.serializers.todo_serializer import TodoSerializer


class TodoView(APIView):

    @staticmethod
    def get_object(id):
        try:
            return TodoModel.objects.get(id=id)
        except TodoModel.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)

    @staticmethod
    def get(request):
        todos = TodoModel.objects.all()
        serialized_todos = TodoSerializer(todos, many=True)
        return Response(serialized_todos.data)

    @staticmethod
    def post(request):
        serialized_todo = TodoSerializer(data=request.data)
        if serialized_todo.is_valid():
            serialized_todo.save()
            return Response(serialized_todo.data, status=status.HTTP_201_CREATED)
        return Response(serialized_todo.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id):
        todo = self.get_object(id)
        serialized_todo = TodoSerializer(todo, data=request.data)
        if serialized_todo.is_valid():
            serialized_todo.save()
            return Response(serialized_todo.data, status=status.HTTP_201_CREATED)
        return Response(serialized_todo.errors, status=status.HTTP_400_BAD_REQUEST)
