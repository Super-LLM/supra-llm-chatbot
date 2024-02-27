from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


class Message(BaseModel):
    content: str


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


@app.post("/query/")
async def get_response(
                      query: Message = ...):
  response = "A dud response to message: " + query.content
  return response


@app.get("/health")
async def get_health():
  return {"Still here :)"}
