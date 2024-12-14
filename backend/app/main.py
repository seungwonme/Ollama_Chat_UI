from fastapi import FastAPI
from .routers import chats
from fastapi.middleware.cors import CORSMiddleware  # 🔥 추가

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 허용할 출처 (Vite 개발 서버)
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용 (GET, POST, PUT 등)
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)

app.include_router(chats.router)


@app.get("/")
async def root():
    return {"message": "Hello World"}
