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
    accel_pos: int
    rpm: int
    speed: float

@app.get("/play")
def play():
    loop.start()
    loop.adjust_volumes([0,0,0,0,0,0])
    return {"status": "success"}

@app.post("/update")
def update(payload: Update):
    handler.accel_pos = payload.accel_pos
    handler.rpm = payload.rpm
    handler.speed = payload.speed
    volume_list = handler.get_volumes()
    loop.adjust_volumes(volume_list)
    return {
        "bass": "{:.3f}".format(volume_list[0]),
        "pad": "{:.3f}".format(volume_list[1]),
        "synth": "{:.3f}".format(volume_list[2]),
        "guitar": "{:.3f}".format(volume_list[3]),
        "drums": "{:.3f}".format(volume_list[4]),
        "drums_2": "{:.3f}".format(volume_list[5])
    }