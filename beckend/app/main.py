from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import users, actions
from app.database import iniciar_banco

app = FastAPI(title="Ecotrack API")

# ✅ DOMÍNIOS PERMITIDOS
origins = [
    "http://localhost:4200",
    "https://myecotrack.vercel.app",
    "https://myecotrack-git-master-sr-samirs-projects.vercel.app",  # ← esse é o que aparece no erro
]

# ✅ CORS CONFIGURADO CORRETAMENTE
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://myecotrack.*\.vercel\.app",   # ⚠️ NÃO use "*" em produção com credentials=True
    allow_credentials=True,
    allow_methods=["*"],    # POST, GET, PUT, DELETE, OPTION
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
