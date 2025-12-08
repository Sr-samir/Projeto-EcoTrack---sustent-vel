from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Depends
from fastapi.responses import JSONResponse
from datetime import datetime

from app import database                      # 👈 importa o módulo
from app.routes.security import get_current_user

router = APIRouter(prefix="/actions", tags=["Ações"])


@router.post("/", summary="Registrar Ação")
async def registrar_acao(
    titulo: str = Form(...),
    descricao: str = Form(...),
    tipo_acao: str = Form(...),
    imagem: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    try:
        # (opcional) validação das opções
        opcoes_validas = ["Reciclagem", "Plantação", "Compostagem"]
        if tipo_acao not in opcoes_validas:
            raise HTTPException(status_code=400, detail="Tipo de ação inválido.")

        # 🔹 Salvar imagem no GridFS usando database.bucket
        if database.bucket is None:
            raise HTTPException(status_code=500, detail="Bucket de arquivos não inicializado.")

        file_id = await database.bucket.upload_from_stream(
            imagem.filename,
            imagem.file,
            metadata={"contentType": imagem.content_type},
        )

        if database.db is None:
            raise HTTPException(status_code=500, detail="Banco de dados não inicializado.")

        # 🔹 Salvar dados da ação
        nova_acao = {
            "titulo": titulo,
            "descricao": descricao,
            "tipo_acao": tipo_acao,
            "imagem_id": file_id,
            "usuario_id": str(current_user["_id"]),
            "usuario_nome": current_user["nome"],
            "dia": datetime.utcnow(),
            "pontos": 10,
            "criado_em": datetime.utcnow(),
        }

        result = await database.db.Acao.insert_one(nova_acao)

        return JSONResponse(
            {
                "message": "Ação registrado com sucesso!",
                "acao_id": str(result.inserted_id),
            }
        )

    except HTTPException:
        # se já for HTTPException, só repassa
        raise
    except Exception as e:
        # Qualquer erro inesperado
        raise HTTPException(status_code=500, detail=str(e))
