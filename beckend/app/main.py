from fastapi import FastAPI
from app.routes import users, actions
from .database import iniciar_banco
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(title="ola")

origins = [
    "http://localhost:4200",  # Angular
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou ["http://localhost:4200"] se quiser restringir
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

    return{"mensagem" : "ola"}


