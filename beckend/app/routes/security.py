from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer


from app.database import get_user_by_id  # Você implementa no Mongo

SECRET_KEY = "SUA_CHAVE_SECRETA_AQUI"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,       
    detail="Token inválido ou expirado.",
    headers={"WWW-Authenticate": "Bearer"},
)
#criação e identificação do jwt

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return {"sub": user_id}
    except JWTError:
        raise credentials_exception



oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = decode_token(token)
        user_id: str = payload.get("sub")

        if not user_id:
            raise credentials_exception

        user = await get_user_by_id(user_id)
        if not user:
            raise credentials_exception

        return user
    except JWTError:
        raise credentials_exception
