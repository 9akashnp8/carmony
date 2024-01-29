import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from handlers.AudioLoop import AudioLoop
from pydantic import BaseModel
from handlers.OBDHandler import OBDHandler

app = FastAPI()
app.mount("/client", StaticFiles(directory="frontend", html=True), name="static")

handler = OBDHandler()
file_paths = os.listdir("wavs/")
file_paths = ["wavs/"+file for file in file_paths]
loop = AudioLoop(file_paths)

class Update(BaseModel):
    name: str
    value: str

@app.get("/play")
def play():
    loop.start()
    loop.adjust_volumes([0,0,0,0,0,0])
    return {"status": "success"}

@app.post("/update")
def update(payload: Update):
    setattr(handler, payload.name, int(payload.value))
    volume_list = handler.get_volumes()
    loop.adjust_volumes(volume_list)
    return {"status": "success"}