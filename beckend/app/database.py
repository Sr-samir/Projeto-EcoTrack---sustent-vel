from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from pymongo import ASCENDING
from bson import ObjectId
from passlib.context import CryptContext

MONGO_URL = "mongodb://127.0.0.1:27017"
DATABASE_NAME = "ecotrack"

# NÃO criar o client/db/bucket aqui mais
client: AsyncIOMotorClient | None = None
db = None
bucket: AsyncIOMotorGridFSBucket | None = None

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def iniciar_banco():
    """
    Essa função será chamada no startup do FastAPI.
    Aqui nós criamos o client e o db no event loop CORRETO.
    """
    global client, db, bucket

    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DATABASE_NAME]
    bucket = AsyncIOMotorGridFSBucket(db)

    await db.usuarios.create_index([("email", ASCENDING)], unique=True)
    print("Você está conectado ao banco de dados e índices criados")


async def get_user_by_email(email: str):
    # aqui assumimos que iniciar_banco() já rodou no startup
    return await db.usuarios.find_one({"email": email})


async def get_user_by_id(user_id: str):
    return await db.usuarios.find_one({"_id": ObjectId(user_id)})
