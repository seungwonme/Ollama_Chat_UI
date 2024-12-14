from fastapi import APIRouter
from ..dependencies import generate_astream, messages
from fastapi.responses import StreamingResponse


router = APIRouter(
    prefix="/chats",
    tags=["chats"],
    responses={404: {"description": "Not found"}},
)


@router.get("/stream")
async def main():
    async def stream():
        async for chunk in generate_astream(messages):
            yield str(chunk)

    return StreamingResponse(stream(), media_type="text/plain")
