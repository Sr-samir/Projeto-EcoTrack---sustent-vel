from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import users, actions
from app.database import iniciar_banco

app = FastAPI(title="Ecotrack API")

# ✅ ORIGENS PERMITIDAS (PRODUÇÃO + LOCAL)
origins = [
    "http://localhost:4200",                 # Angular local
    "https://myecotrack.vercel.app",         # ✅ SEU FRONTEND EM PRODUÇÃO
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # ❌ NÃO use mais ["*"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ INICIALIZAÇÃO DO BANCO
@app.on_event("startup")
async def startup_event():
    await iniciar_banco()

# ✅ ROTAS
app.include_router(users.router)
app.include_router(actions.router)

# ✅ ROTA TESTE
@app.get("/")
def read_root():
    return {"mensagem": "API Ecotrack online"}
