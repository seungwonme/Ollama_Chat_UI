from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

llm = ChatOllama(model="llama3.2-vision", temperature=0.3)

messages = []


async def generate_astream(messages: list):
    response = ""
    async for chunk in llm.astream(messages):
        response += str(chunk.content)
        yield str(chunk.content)
    messages.append(AIMessage(content=response))
