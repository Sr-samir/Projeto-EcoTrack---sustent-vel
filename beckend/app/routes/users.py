from fastapi import APIRouter, HTTPException
from app.database import db
from app.models import Usuario, UsuarioLogin,Acao
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_token



router = APIRouter( tags=["Usuarios"])

#funçao que faz a login do usuario =>

@router.post("/login")

async def fazer_login(usuariologin:UsuarioLogin):
    usuario_encontrado = await db.acao.find_one({"email":usuariologin.email})
    if not usuario_encontrado:
        raise HTTPException(status_code=404, detail= "usuario não encontrado")

    if usuariologin.senha != usuario_encontrado["senha"]:
        raise HTTPException(status_code=401, detail= " senha incorreta")
    
    return {
        "success": True,
        "message":"login efetuado com sucesso",
        "usuario":{
            "nome":usuario_encontrado.get("nome"),
             "senha":usuario_encontrado.get("senha")
        }

        
    }
           

#funçao que registra o usuario =>

@router.post("/register")

async def criar_usuario(usuario: Usuario) :
    usuario_existente = await db.acao.find_one({"email":usuario.email})
    if usuario_existente:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado.")
     
    usuario_dict = usuario.dict(exclude_unset=True)   
    resultado = await db.acao.insert_one(usuario_dict) 

    usuario_dict["_id"] = str(resultado.inserted_id)
    return {
        "success": True,
        "message": "Usuário criado com sucesso!",
        "usuario": usuario_dict
    }
    

#lista açoes do usuario logado com jwt =>

oauth2 = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.get("/acao/minhas")
async def listar_acoes(token: str = Depends(oauth2)):
    user_id = decode_token(token)["sub"]
    
    cursor = db.acao.find({"usuario_id": user_id})
    acao = []
    async for a in cursor:
        a["_id"] = str(a["_id"])
        acao.append(a)
    
    return acao



# @router.get("/ranking")
# async def ranking():
#     acao = []
#     cursor = db.acao.find().sort('pontos', -1)
#     async for u in cursor:
#         u["_id"] = str(u["_id"])

#         acao.append(u)

#     return acao    