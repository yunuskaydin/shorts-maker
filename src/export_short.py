import subprocess
import os
from datetime import datetime

def export_short(
    video_path,
    start_time=None,
    end_time=None,
    subtitles_path=None,
    is_premium=False
):
    # Premium olmayan kullanıcılar için limit kontrolü
    if not is_premium:
        if end_time and start_time and (end_time - start_time) > 30:
            raise ValueError("Ücretsiz kullanıcılar için maksimum 30 saniye export yapılabilir")
    elif end_time and start_time and (end_time - start_time) > 60:
        raise ValueError("Maksimum 60 saniye export yapılabilir")

    # Dosya yollarını tam yol yap
    ffmpeg_path = r"C:\ffmpeg\bin\ffmpeg.exe"
    video_path = os.path.abspath(video_path)
    output_dir = os.path.abspath("data/exports")
    os.makedirs(output_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = os.path.join(output_dir, f"short_{timestamp}.mp4")

    # Filtreleri oluştur
    filters = ["crop=ih*9/16:ih"]

    # Altyazı ekle
    if subtitles_path and os.path.exists(subtitles_path):
        subtitles_path = os.path.abspath(subtitles_path)
        subtitles_path = subtitles_path.replace("\\", "/")
        filters.append(f"subtitles='{subtitles_path}'")

    vf_filter = ",".join(filters)

    # Watermark eklemek istiyorsak filter_complex kullan
    if not is_premium:
        watermark_path = os.path.abspath("assets/watermark.png")
        if os.path.exists(watermark_path):
            watermark_path = watermark_path.replace("\\", "/")
            
            # Filter complex hazırlıyoruz (crop + subtitles varsa + overlay)
            filter_complex_parts = ["crop=ih*9/16:ih"]
            if subtitles_path and os.path.exists(subtitles_path):
                filter_complex_parts.append(f"subtitles='{subtitles_path}'")
            filter_complex_parts.append("overlay=W-w-10:H-h-10")
            
            filter_complex = ",".join(filter_complex_parts)

            cmd_watermark = [
                ffmpeg_path,
                "-i", video_path,
                "-i", watermark_path,
                "-filter_complex", filter_complex,
                "-map", "0:a?",
                "-c:a", "aac",
                "-c:v", "libx264",
                "-y"
            ]

            # Video kesme
            if start_time is not None:
                cmd_watermark.extend(["-ss", str(start_time)])
            if end_time is not None and start_time is not None:
                duration = float(end_time) - float(start_time)
                cmd_watermark.extend(["-t", str(duration)])

            cmd_watermark.append(output_path)

            subprocess.run(cmd_watermark, check=True)
            return output_path

    # Eğer watermark yoksa normal export
    cmd = [
        ffmpeg_path,
        "-i", video_path,
        "-vf", vf_filter,
        "-c:a", "aac",
        "-c:v", "libx264",
        "-y"
    ]

    # Video kesme
    if start_time is not None:
        cmd.extend(["-ss", str(start_time)])
    if end_time is not None and start_time is not None:
        duration = float(end_time) - float(start_time)
        cmd.extend(["-t", str(duration)])

    cmd.append(output_path)

    subprocess.run(cmd, check=True)
    return output_path
