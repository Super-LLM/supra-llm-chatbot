import asyncio
from contextlib import asynccontextmanager
from typing import Any
import uvicorn
from langchain import hub
from langchain.agents import initialize_agent, AgentType
from langchain.memory import ConversationBufferWindowMemory
from langchain_core.outputs import LLMResult
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain_openai import AzureChatOpenAI
from langchain.callbacks.streaming_aiter import AsyncIteratorCallbackHandler
from fastapi.responses import StreamingResponse


# warnings.filterwarnings('ignore')

# config = dotenv_values(".env")

api_version = "2024-02-15-preview"
DEPLOYMENT_NAME = "gpt-35-turbo-default"

llm = AzureChatOpenAI(
    openai_api_version=api_version,
    azure_deployment=DEPLOYMENT_NAME,
    openai_api_type="azure",
    streaming=True,
    temperature=0.0
)

memory = ConversationBufferWindowMemory(
    memory_key="chat_history",
    k=5,
    return_messages=True,
    output_key="output"
)
prompt = hub.pull("hwchase17/structured-chat-agent")

# TODO: Replace with a non depricated tool. The code above would be a start as long as you replace tools.
agent = initialize_agent(
    agent=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION,
    tools=[],
    llm=llm,
    verbose=True,
    max_iterations=3,
    early_stopping_method="generate",
    memory=memory,
    return_intermediate_steps=False,
)

app = FastAPI()

# Add CORS
origin = ['*']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origin,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)


class Message(BaseModel):
    content: str


class AsyncCallbackHandler(AsyncIteratorCallbackHandler):
    content: str = ""
    final_answer: bool = False

    def __init__(self) -> None:
        super().__init__()

    async def on_llm_new_token(self, token: str, **kwargs: Any) -> None:
        self.content += token
        if self.final_answer:
            if '"action_input": "' in self.content:
                if token not in ['"', "}"]:
                    self.queue.put_nowait(token)
        elif "Final Answer" in self.content:
            self.final_answer = True
            self.content = ""

    async def on_llm_end(self, response: LLMResult, **kwargs: Any) -> None:
        if self.final_answer:
            self.content = ""
            self.final_answer = False
            self.done.set()
        else:
            self.content = ""


async def run_call(query: str, stream_it: AsyncCallbackHandler):
    agent.agent.llm_chain.llm.callbacks = [stream_it]
    response = await agent.acall(inputs={"input": query})


async def create_gen(query: str, stream_it: AsyncCallbackHandler):
    task = asyncio.create_task(run_call(query, stream_it))
    async for token in stream_it.aiter():
        yield token
    await task


@app.post("/query/")
async def get_response(query: Message = ...):
    stream_it = AsyncCallbackHandler()
    gen = create_gen(query.content, stream_it)
    return StreamingResponse(gen, media_type="text/event-stream")


@app.get("/health")
async def get_health():
    return {"Still here :)"}


@asynccontextmanager
async def lifespan(app: FastAPI):
    port = app.port
    print("The port used for this app is", port)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
