import yt_dlp

def download_video(url, output_path):
    ydl_opts = {
        'format': 'best',
        'outtmpl': output_path + '/%(title)s.%(ext)s',
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
