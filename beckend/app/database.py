from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from pymongo import ASCENDING
from bson import ObjectId
from passlib.context import CryptContext


MONGO_URL = "mongodb://127.0.0.1:27017" 




DATABASE_NAME = "ecotrack"


client = AsyncIOMotorClient(MONGO_URL)




db = client[DATABASE_NAME]
bucket = AsyncIOMotorGridFSBucket(db)

 
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def iniciar_banco():
    await db.usuarios.create_index([("email", ASCENDING)], unique= True)
    print("Voçe está conectado ao banco d dados  e indices criados")




async def get_user_by_email(email: str):
    return await db.usuarios.find_one({"email": email})

async def get_user_by_id(user_id: str):
    return await db.usuarios.find_one({"_id": ObjectId(user_id)})



