from pydantic import BaseModel, Field
from typing import Optional

class Usuario(BaseModel):
    # id: Optional[str] = None 
    nome: str
    email: str
    senha:str= Field(..., max_length=72)
    pontos: int = 0

class UsuarioLogin(BaseModel):
    email:str
    senha:str

class Acao(BaseModel):
    titulo: str
    descricao: str
    imagem_id: Optional[str] = None


class UpdatePassword(BaseModel):
     senha_atual:str
     nova_senha:str

class UpdateProfile(BaseModel):
     nome:str
     email:str

