from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os

from src.download_video import download_video
from src.extract_audio import extract_audio
from src.transcribe_audio import transcribe_audio
from src.generate_subtitles import generate_subtitles
from src.export_short import export_short

app = FastAPI(title="YouTube Shorts Maker API")

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://169.254.20.153:3000"],  # Frontend'in çalıştığı port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoRequest(BaseModel):
    url: str
    start_time: Optional[float] = None
    end_time: Optional[float] = None
    add_captions: Optional[bool] = True
    is_premium: Optional[bool] = False

@app.post("/process-video")
async def process_video(request: VideoRequest):
    try:
        # Video indirme
        output_path = "data/downloads"
        os.makedirs(output_path, exist_ok=True)
        video_path = download_video(request.url, output_path)
        
        # Ses çıkarma
        audio_path = os.path.splitext(video_path)[0] + ".wav"
        extract_audio(video_path, audio_path)
        
        # Transkripsiyon
        transcript = transcribe_audio(audio_path, "model/vosk-model-en-us-0.22-lgraph")    

        # Altyazı oluşturma
        if request.add_captions:
            subtitles_path = os.path.splitext(audio_path)[0] + ".srt"
            generate_subtitles(transcript, subtitles_path)
        else:
            subtitles_path = None
        
        # Short oluşturma
        final_path = export_short(
            video_path,
            start_time=request.start_time,
            end_time=request.end_time,
            subtitles_path=subtitles_path,
            is_premium=request.is_premium
        )
        
        return {
            "status": "success",
            "message": "Video başarıyla işlendi",
            "output_path": final_path
        }
        
    except Exception as e:
        import traceback
        print(traceback.format_exc())  # <-- Bu satır terminale tam hata yığını basar
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "YouTube Shorts Maker API'ye Hoş Geldiniz!"} 