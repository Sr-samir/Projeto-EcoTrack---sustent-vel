from fastapi import APIRouter, HTTPException
from app.database import db, ObjectId
from app.models import Usuario, UsuarioLogin, Acao
from fastapi import Depends
from app.routes.security import get_current_user, create_access_token



router = APIRouter( tags=["Usuarios"])

#funçao que faz a login do usuario =>

@router.post("/login")
async def fazer_login(usuariologin: UsuarioLogin):
    usuario = await db.usuarios.find_one({"email": usuariologin.email})
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    if usuariologin.senha != usuario["senha"]:  # Depois vamos criptografar!
        raise HTTPException(status_code=401, detail="Senha incorreta")

    token = create_access_token({"sub": str(usuario["_id"])})

    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": {
            "nome": usuario.get("nome"),
            "email": usuario.get("email")
        }
    }
           

#funçao que registra o usuario =>

@router.post("/register")
async def criar_usuario(usuario: Usuario):
    usuario_existente = await db.usuarios.find_one({"email": usuario.email})

    if usuario_existente:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado.")

    usuario_dict = usuario.dict()
    resultado = await db.usuarios.insert_one(usuario_dict)

    usuario_dict["_id"] = str(resultado.inserted_id)
    del usuario_dict["senha"]  # Segurança!

    return {
        "success": True,
        "message": "Usuário criado com sucesso!",
        "usuario": usuario_dict
    }

#lista açoes do usuario logado com jwt =>



@router.get("/acoes/minhas")
async def listar_acoes_usuario(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])  # string mesmo

    cursor = db.Acao.find({"usuario_id": user_id})  # compara com string
    acoes = []

    async for a in cursor:
        a["_id"] = str(a["_id"])
        usuario = await db.usuarios.find_one({"_id": ObjectId(user_id)})
        acoes.append({
            "dia": a.get("dia", "N/A"),
            "pontos": a.get("pontos", 10),
            "media": a.get("media", 0),
            "usuario_nome": usuario.get("nome") if usuario else "Desconhecido"
        })

    return acoes






# @router.get("/ranking")
# async def ranking():
#     acao = []
#     cursor = db.acao.find().sort('pontos', -1)
#     async for u in cursor:
#         u["_id"] = str(u["_id"])

#         acao.append(u)

#     return acao    