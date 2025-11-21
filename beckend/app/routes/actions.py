from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Depends
from fastapi.responses import JSONResponse
from app.database import bucket, db
from app.routes.security import get_current_user
from datetime import datetime

router = APIRouter(prefix="/actions", tags=["Ações"])

@router.post("/", summary="Registrar Ação")
async def registrar_acao(
    titulo: str = Form(...),
    descricao: str = Form(...),
    imagem: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        # Salvar imagem no GridFS
        file_id = await bucket.upload_from_stream(
            imagem.filename,
            imagem.file,
            metadata={"contentType": imagem.content_type}
        )

        # Salvar dados da ação
        nova_acao = {
               "titulo": titulo,
               "descricao": descricao,
               "imagem_id": file_id,
               "usuario_id": str(current_user["_id"]),
               "usuario_nome": current_user["nome"],
               "dia": datetime.utcnow().day,
               "pontos": 10
        }

        result = await db.acoes.insert_one(nova_acao)

        return JSONResponse({
            "message": "Ação registrada com sucesso!",
            "acao_id": str(result.inserted_id),
            # "imagem_id": str(file_id),
            # "usuario_nome": current_user["nome"]
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
