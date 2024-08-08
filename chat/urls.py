from django.urls import path
from .views import chat_list, chat_detail, message_list, generate

urlpatterns = [
    path("chats/", chat_list),
    path("chats/<int:pk>/", chat_detail),
    path("chats/<int:chat_id>/messages/", message_list),
    path("generate/", generate),
]