from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from pymongo import ASCENDING
from bson import ObjectId
from passlib.context import CryptContext

MONGO_URL = "mongodb://127.0.0.1:27017"
DATABASE_NAME = "ecotrack"

client: AsyncIOMotorClient | None = None
db = None
bucket: AsyncIOMotorGridFSBucket | None = None

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def iniciar_banco():
    """
    Inicializa a conexão com o MongoDB e cria índices.
    Se não conseguir conectar, levanta erro rápido.
    """
    global client, db, bucket

    print("Iniciando conexão com MongoDB...")

    # timeout de 5 segundos pra seleção do servidor
    client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=5000)
    db = client[DATABASE_NAME]
    bucket = AsyncIOMotorGridFSBucket(db)

    # Testa conexão com um ping
    try:
        await db.command("ping")
        print("Conectado ao MongoDB com sucesso.")
    except Exception as e:
        print("❌ Erro ao conectar no MongoDB:", repr(e))
        # re-levanta o erro pra FastAPI falhar no startup e logar o stack trace
        raise

    # Se passou do ping, cria o índice
    await db.usuarios.create_index([("email", ASCENDING)], unique=True)
    print("Índice de email criado em 'usuarios'. Banco pronto.")


async def get_user_by_email(email: str):
    return await db.usuarios.find_one({"email": email})


async def get_user_by_id(user_id: str):
    return await db.usuarios.find_one({"_id": ObjectId(user_id)})
