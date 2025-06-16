import subprocess

def extract_audio(video_path, audio_path):
    cmd = [
        r'C:\ffmpeg\bin\ffmpeg.exe', '-i', video_path, '-vn',
        '-acodec', 'pcm_s16le', '-ar', '16000', '-ac', '1',
        audio_path
    ]
    subprocess.run(cmd, check=True)