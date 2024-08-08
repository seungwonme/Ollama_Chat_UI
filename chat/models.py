from django.db import models

class Chat(models.Model):
    subject = models.CharField(max_length=100)
    last_update = models.DateTimeField(auto_now_add=True) # last message date

    def __str__(self):
        return f"{self.subject[:20] + '...' if self.subject.__len__() > 23 else self.subject}"

class Message(models.Model):
    chat = models.ForeignKey(Chat, related_name="messages", on_delete=models.CASCADE)
    is_user = models.BooleanField() # True: user, False: assistant
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{'User' if self.is_user else 'Assistant'}: {self.content[:27] + '...' if self.content.__len__() > 30 else self.content}"

