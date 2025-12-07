import os

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from pymongo import ASCENDING
from bson import ObjectId
from passlib.context import CryptContext

# -------------------------------------------------------------------
# Configuração da URI do MongoDB
# Railway usa MONGO_URI
# Local pode usar MONGO_URL
# Se nenhum existir → localhost
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


async def iniciar_banco():
    """
    Inicializa a conexão com o MongoDB e cria índices necessários.
    Chamada no evento de startup do FastAPI.
    """
    global client, db, bucket

    print(f"Iniciando conexão com MongoDB em: {MONGO_URI!r}")

    # Timeout de 5 segundos para tentar conectar
    client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = client[DATABASE_NAME]
    bucket = AsyncIOMotorGridFSBucket(db)

    # Testa conexão
    try:
        await db.command("ping")
        print(f"✅ Conectado ao MongoDB. Banco: {DATABASE_NAME}")
    except Exception as e:
        print("❌ Erro ao conectar no MongoDB:", repr(e))
        raise

    # Cria índice único para e-mail dos usuários
    await db.usuarios.create_index([("email", ASCENDING)], unique=True)
    print("✅ Índice único em 'email' criado com sucesso.")


async def get_user_by_email(email: str):
    return await db.usuarios.find_one({"email": email})


async def get_user_by_id(user_id: str):
    return await db.usuarios.find_one({"_id": ObjectId(user_id)})
