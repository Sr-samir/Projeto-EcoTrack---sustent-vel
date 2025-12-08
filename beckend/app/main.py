from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import users, actions
from app.database import iniciar_banco

app = FastAPI(title="Ecotrack API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # <-- libera tudo (pra teste)
    allow_credentials=False,      # <-- importante: False se usar "*"
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    await iniciar_banco()

# ✅ ROTAS
app.include_router(users.router)
app.include_router(actions.router)

@app.get("/")
def read_root():
    return {"mensagem": "API Ecotrack online"}
