from fastapi import APIRouter, HTTPException
from app.database import db, ObjectId, pwd_context
from app.models import Usuario, UsuarioLogin, Acao, UpdatePassword, UpdateProfile
from fastapi import Depends
from app.routes.security import get_current_user, create_access_token


router = APIRouter( tags=["Usuarios"])

#funçao que faz a login do usuario =>

@router.post("/login")
async def fazer_login(usuariologin: UsuarioLogin):
    usuario = await db.usuarios.find_one({"email": usuariologin.email})

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    if not pwd_context.verify(usuariologin.senha, usuario["senha"]):
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
    # Verifica se o e-mail já existe
    usuario_existente = await db.usuarios.find_one({"email": usuario.email})
    if usuario_existente:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado.")

    usuario_dict = usuario.dict()

    # Garante que a senha não passe do limite do bcrypt (72 bytes)
    senha_limpa = usuario_dict["senha"]
    if len(senha_limpa) > 72:
        senha_limpa = senha_limpa[:72]

    # Hash da senha corrigido
    usuario_dict["senha"] = pwd_context.hash(senha_limpa)

    # Inserir usuário no banco
    resultado = await db.usuarios.insert_one(usuario_dict)

    usuario_dict["_id"] = str(resultado.inserted_id)
    del usuario_dict["senha"]  # Nunca retornar a senha!

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
            "tipo_acao": a.get("tipo_acao", "Tipo desconhecido"),
            "dia": a.get("dia", "N/A"),
            "pontos": a.get("pontos", 10),
            "media": a.get("media", 0),
            "usuario_nome": usuario.get("nome") if usuario else "Desconhecido"
        })

    return acoes




#Alteração da senha =>


@router.put("/usuario/senha")
async def atualizar_senha(data: UpdatePassword, current_user: dict = Depends(get_current_user)):

    if not pwd_context.verify(data.senha_atual, current_user["senha"]):
        raise HTTPException(status_code=400, detail="Senha atual incorreta")

    nova_hash = pwd_context.hash(data.nova_senha)

    await db.usuarios.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"senha": nova_hash}}
    )

    return {"message": "Senha atualizada com sucesso!"}



#Atualização do nome e email =>

@router.put("/usuario/atualizar")
async def atualizar_usuario(data: UpdateProfile, current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]

    await db.usuarios.update_one(
        {"_id": user_id},
        {"$set": {"nome": data.nome, "email": data.email}}
    )

    return {"message": "Dados atualizados com sucesso"}



#endpoint para visualizar os dados no frontend =>

@router.get("/usuario/me")
async def get_usuario(current_user: dict = Depends(get_current_user)):
    current_user["_id"] = str(current_user["_id"])
    return current_user



# @router.get("/ranking")
# async def ranking():
#     acao = []
#     cursor = db.acao.find().sort('pontos', -1)
#     async for u in cursor:
#         u["_id"] = str(u["_id"])

#         acao.append(u)

#     return acao    
