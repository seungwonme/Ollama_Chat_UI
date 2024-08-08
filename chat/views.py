from rest_framework.views import APIView
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.http import StreamingHttpResponse
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
import requests
import json

class ChatView(APIView):
    def get(self, request):
        chats = Chat.objects.all()
        serializer = ChatSerializer(chats, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = ChatSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def chat_detail(request, pk):
    chat = get_object_or_404(Chat, pk=pk)
    serializer = ChatSerializer(chat)
    return Response(serializer.data)


@api_view(["GET"])
def message_list(request, chat_id):
    messages = Message.objects.filter(chat_id=chat_id)
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)


def stream_data(prompt, model, chat_id):
    url = "http://localhost:11434/api/generate"
    data = {"model": model, "prompt": prompt, "stream": True}
    s = requests.Session()

    full_response = ""
    with s.post(url, stream=True, json=data) as resp:
        for line in resp.iter_lines():
            json_data = json.loads(line.decode("utf-8"))
            if "response" in json_data:
                chunk = json_data["response"]
                full_response += chunk
                yield f"{chunk}"

    # Save the full response to the database after streaming is complete
    chat = get_object_or_404(Chat, id=chat_id)
    Message.objects.create(chat=chat, content=full_response, is_user=False)


@csrf_exempt
@api_view(["POST"])
def generate(request):
    prompt = request.data["prompt"]
    model = request.data["model"]
    chat_id = request.data["chat_id"]

    chat = get_object_or_404(Chat, id=chat_id)
    Message.objects.create(chat=chat, content=prompt, is_user=True)

    response = StreamingHttpResponse(stream_data(prompt, model, chat_id), content_type="text/event-stream")
    return response
