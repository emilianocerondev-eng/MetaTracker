from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import *

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/metas")
def get_metas():
    return consultar_metas()

@app.get("/metas/{meta_id}")
def get_one_meta(meta_id: int):
    todas = consultar_metas()
    meta = next((m for m in todas if m['id'] == meta_id), None)
    if not meta:
        raise HTTPException(status_code=404, detail="No encontrada")
    movimientos = consultar_movimientos_por_meta(meta_id)
    return {"meta": meta, "movimientos": movimientos}

@app.post("/metas")
def add_meta(meta: dict = Body(...)):
    return crear_meta(meta)

@app.post("/movimientos")
def add_movimiento(mov: dict = Body(...)):
    return registrar_movimiento(mov)

@app.put("/metas/{meta_id}")
def update_meta(meta_id: int, meta: dict = Body(...)):
    datos = actualizar_estado_meta(meta_id, meta)

    if datos:
        return datos

    return {"error": "No se pudo conectar con la base de datos"}

@app.delete("/metas/{meta_id}")
def delete_meta(meta_id: int):
    return eliminar_meta(meta_id)