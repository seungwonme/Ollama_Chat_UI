from django.urls import path
from .views import ChatView, chat_detail, message_list, generate

urlpatterns = [
    path("chats/", ChatView.as_view()),
    path("chats/<int:pk>/", chat_detail),
    path("chats/<int:chat_id>/messages/", message_list),
    path("generate/", generate),
]
