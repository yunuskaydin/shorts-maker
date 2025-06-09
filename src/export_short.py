import ffmpeg
import os
from datetime import datetime

def export_short(
    video_path,
    start_time=None,
    end_time=None,
    subtitles_path=None,
    is_premium=False
):
    """
    Video'yu Shorts formatına dönüştürür.
    
    Args:
        video_path (str): İşlenecek video dosyasının yolu
        start_time (float, optional): Başlangıç zamanı (saniye)
        end_time (float, optional): Bitiş zamanı (saniye)
        subtitles_path (str, optional): Altyazı dosyasının yolu
        is_premium (bool): Premium kullanıcı kontrolü
    
    Returns:
        str: İşlenmiş video dosyasının yolu
    """
    # Premium olmayan kullanıcılar için limit kontrolü
    if not is_premium:
        if end_time and start_time and (end_time - start_time) > 30:
            raise ValueError("Ücretsiz kullanıcılar için maksimum 30 saniye export yapılabilir")
    
    # Premium kullanıcılar için 60 saniye limiti
    elif end_time and start_time and (end_time - start_time) > 60:
        raise ValueError("Maksimum 60 saniye export yapılabilir")
    
    output_dir = "data/exports"
    os.makedirs(output_dir, exist_ok=True)
    
    # Çıktı dosya adını oluştur
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = os.path.join(output_dir, f"short_{timestamp}.mp4")
    
    # FFmpeg komutunu oluştur
    stream = ffmpeg.input(video_path)
    
    # Video kesme
    if start_time is not None and end_time is not None:
        stream = stream.trim(start=start_time, end=end_time)
    
    # 9:16 aspect ratio için crop
    stream = stream.crop(x='(iw-ih*9/16)/2', y=0, width='ih*9/16', height='ih')
    
    # Altyazı ekleme
    if subtitles_path and os.path.exists(subtitles_path):
        stream = ffmpeg.filter(stream, 'subtitles', subtitles_path)
    
    # Watermark ekleme (premium olmayan kullanıcılar için)
    if not is_premium:
        watermark_path = "assets/watermark.png"
        if os.path.exists(watermark_path):
            watermark = ffmpeg.input(watermark_path)
            stream = ffmpeg.overlay(stream, watermark, x='W-w-10', y='H-h-10')
    
    # Video'yu export et
    stream = ffmpeg.output(stream, output_path, acodec='aac', vcodec='h264')
    ffmpeg.run(stream, overwrite_output=True)
    
    return output_path
