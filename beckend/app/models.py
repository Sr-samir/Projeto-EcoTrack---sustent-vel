from pydantic import BaseModel
from typing import Optional

class Usuario(BaseModel):
    # id: Optional[str] = None 
    nome: str
    email: str
    senha:str
    pontos: int = 0

class UsuarioLogin(BaseModel):
    email:str
    senha:str

class Acao(BaseModel):
    titulo: str
    descricao: str
    imagem_id: Optional[str] = None