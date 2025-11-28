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
    tipo_acao: str = Form(...),      # 👈 NOVO CAMPO
    imagem: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        # (opcional) validação das opções
        opcoes_validas = ["Reciclagem", "Plantação", "Compostagem"]
        if tipo_acao not in opcoes_validas:
            raise HTTPException(status_code=400, detail="Tipo de ação inválido.")

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
            "tipo_acao": tipo_acao,                    # 👈 SALVANDO NO BANCO
            "imagem_id": file_id,
            "usuario_id": str(current_user["_id"]),
            "usuario_nome": current_user["nome"],
            "dia": datetime.utcnow().day,
            "pontos": 10,
            "criado_em": datetime.utcnow(),            # (opcional, mas útil)
        }

        result = await db.Acao.insert_one(nova_acao)

        return JSONResponse({
            "message": "Ação registrada com sucesso!",
            "acao_id": str(result.inserted_id),
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
