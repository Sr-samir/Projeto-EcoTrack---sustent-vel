from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from pymongo import ASCENDING


MONGO_URL = "mongodb://127.0.0.1:27017" 




DATABASE_NAME = "ecotrack"


client = AsyncIOMotorClient(MONGO_URL)




db = client[DATABASE_NAME]
bucket = AsyncIOMotorGridFSBucket(db)

 


async def iniciar_banco():
    await db.usuarios.create_index([("email", ASCENDING)], unique= True)
    print("Voçe está conectado ao banco d dados  e indices criados")



