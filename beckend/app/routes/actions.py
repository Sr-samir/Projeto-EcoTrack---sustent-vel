from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from app.database import bucket, db

router = APIRouter(prefix="/actions", tags=["Ações"])

@router.post("/", summary="Registrar Ação")
async def registrar_acao(
    titulo: str = Form(...),
    descricao: str = Form(...),
    imagem: UploadFile = File(...)
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
            "imagem_id": file_id
        }

        result = await db.acoes.insert_one(nova_acao)

        return JSONResponse({
            "message": "Ação registrada com sucesso!",
            "acao_id": str(result.inserted_id),
            "imagem_id": str(file_id)
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
