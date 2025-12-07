import os
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from pymongo import ASCENDING
from bson import ObjectId
from passlib.context import CryptContext

# -------------------------------------------------------------------
# ✅ Configuração da URI do MongoDB
# Railway → MONGO_URI
# Local → MONGO_URL ou fallback localhost
# -------------------------------------------------------------------

MONGO_URI = (
    os.getenv("MONGO_URI")
    or os.getenv("MONGO_URL")
    or "mongodb://127.0.0.1:27017"
)

DATABASE_NAME = os.getenv("MONGO_DB_NAME", "ecotrack")

client: AsyncIOMotorClient | None = None
db = None
bucket: AsyncIOMotorGridFSBucket | None = None

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# -------------------------------------------------------------------
# ✅ Inicialização do banco (chamar no startup do FastAPI)
# -------------------------------------------------------------------
async def iniciar_banco():
    global client, db, bucket

    print(f"🔌 Conectando ao MongoDB em: {MONGO_URI}")

    # Timeout de 5 segundos
    client = AsyncIOMotorClient(
        MONGO_URI,
        serverSelectionTimeoutMS=5000
    )

    db = client[DATABASE_NAME]
    bucket = AsyncIOMotorGridFSBucket(db)

    # ✅ Testa conexão
    try:
        await db.command("ping")
        print(f"✅ Conectado ao MongoDB com sucesso! Banco: {DATABASE_NAME}")
    except Exception as e:
        print("❌ Erro ao conectar no MongoDB:")
        print(repr(e))
        raise

    # ✅ Cria índice único para e-mail
    await db.usuarios.create_index(
        [("email", ASCENDING)],
        unique=True
    )

    print("✅ Índice único em 'email' criado com sucesso.")


# -------------------------------------------------------------------
# ✅ Funções auxiliares
# -------------------------------------------------------------------

async def get_user_by_email(email: str):
    return await db.usuarios.find_one({"email": email})


async def get_user_by_id(user_id: str):
    return await db.usuarios.find_one({"_id": ObjectId(user_id)})
