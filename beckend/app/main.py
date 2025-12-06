from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import users, actions
from app.database import iniciar_banco

app = FastAPI(title="ola")

origins = [
    "http://localhost:4200",  # Angular
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou origins se quiser restringir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await iniciar_banco()

app.include_router(users.router)
app.include_router(actions.router)


@app.get("/")
def read_root():
    return {"mensagem": "ola"}
