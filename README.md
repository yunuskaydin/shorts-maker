# YouTube Shorts Maker

YouTube videolarını Shorts formatına dönüştürmek için kullanılan bir araç.

## Özellikler

### Ücretsiz Versiyon
- Ayda 5 video export
- Video'da watermark
- Maksimum 30 saniye export

### Premium Versiyon
- Sınırsız export
- Watermark kaldırma
- 60 saniyeye kadar short çıkarma
- AI ile otomatik "highlight" kesme önerisi
- Otomatik subtitles + renkli caption desteği

## Kurulum

1. Gerekli paketleri yükleyin:
```bash
pip install -r requirements.txt
```

2. FFmpeg'i yükleyin:
- Windows: https://ffmpeg.org/download.html
- Linux: `sudo apt-get install ffmpeg`
- macOS: `brew install ffmpeg`

3. Uygulamayı başlatın:
```bash
uvicorn src.main:app --reload
```

## API Kullanımı

### Video İşleme
```http
POST /process-video
Content-Type: application/json

{
    "url": "https://www.youtube.com/watch?v=...",
    "start_time": 10.5,
    "end_time": 40.5,
    "add_captions": true,
    "is_premium": false
}
```

## Geliştirme

Proje yapısı:
```
.
├── src/
│   ├── main.py              # FastAPI uygulaması
│   ├── download_video.py    # Video indirme
│   ├── extract_audio.py     # Ses çıkarma
│   ├── transcribe_audio.py  # Transkripsiyon
│   ├── generate_subtitles.py # Altyazı oluşturma
│   └── export_short.py      # Short export
├── data/
│   ├── downloads/          # İndirilen videolar
│   └── exports/           # Export edilen shorts
├── assets/
│   └── watermark.png      # Watermark görseli
└── requirements.txt       # Bağımlılıklar
```

## Lisans

MIT 