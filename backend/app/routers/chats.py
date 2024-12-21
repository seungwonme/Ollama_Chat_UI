from fastapi import APIRouter, Request
from ..dependencies import generate_astream, messages
from langchain_core.messages import HumanMessage
from fastapi.responses import StreamingResponse

router = APIRouter(
    prefix="/chats",
    tags=["chats"],
    responses={404: {"description": "Not found"}},
)


@router.post("")
async def generate_new_message(request: Request):
    body = await request.json()
    message = body.get("message")
    if message:
        messages.append(HumanMessage(content=message))
        print(messages)
        return StreamingResponse(generate_astream(messages), media_type="text/plain")
    else:
        return {"error": "No message provided"}
