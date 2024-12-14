from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

llm = ChatOllama(model="llama3.2-vision", temperature=0.3)


async def generate_astream(messages: list):
    async for chunk in llm.astream(messages):
        yield str(chunk.content)


messages = [
    SystemMessage("You are a so kind chatbot."),
    HumanMessage("Hello!"),
    AIMessage("Hello!"),
]
