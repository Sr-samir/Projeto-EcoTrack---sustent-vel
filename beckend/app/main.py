from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import users, actions
from app.database import iniciar_banco

app = FastAPI(title="Ecotrack API")

# ✅ DOMÍNIOS PERMITIDOS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://myecotrack.vercel.app",
        "https://myecotrack-git-master-sr-samirs-projects.vercel.app",
        "http://localhost:4200",
    ],
    allow_credentials=True,   # se NÃO usar cookies, pode pôr False
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
