from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

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
    tipo_acao: str                   # 👈 NOVO CAMPO
    imagem_id: Optional[str] = None
    usuario_id: Optional[str] = None
    usuario_nome: Optional[str] = None
    dia: Optional[int] = None
    pontos: Optional[int] = None
    criado_em: Optional[datetime] = None


class UpdatePassword(BaseModel):
     senha_atual:str
     nova_senha:str

class UpdateProfile(BaseModel):
     nome:str
     email:str

