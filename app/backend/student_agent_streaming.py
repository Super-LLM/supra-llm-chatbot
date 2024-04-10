from langchain.callbacks import AsyncIteratorCallbackHandler
from langchain_core.outputs import LLMResult
from langchain_openai import AzureChatOpenAI

import warnings

from agent import create_agent
import asyncio
from contextlib import asynccontextmanager
from typing import Any
import uvicorn
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

warnings.filterwarnings('ignore')

api_version = "2024-02-15-preview"
DEPLOYMENT_NAME = "gpt-35-turbo-default"
llm = AzureChatOpenAI(
    openai_api_version=api_version,
    azure_deployment=DEPLOYMENT_NAME,
    openai_api_type="azure",
    streaming=True,
    temperature=0.0
)

agent = create_agent(llm=llm)

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
    """
    This is a langchain CallbackHandler for streaming llm results asynchronously.
    """
    content: str = ""
    final_answer: bool = False

    async def on_llm_new_token(self, token: str, **kwargs: Any) -> None:
        self.content += token
        # if we passed the final answer, we put tokens in queue
        if self.final_answer:
            if token not in ['"', "}"]:
                self.queue.put_nowait(token)
        elif "Final Answer:" in self.content:
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
