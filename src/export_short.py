import subprocess

def export_short(video_path, srt_path, output_path):
    cmd = [
        'ffmpeg', '-i', video_path,
        '-vf', "crop=ih*9/16:ih,subtitles={}".format(srt_path),
        '-c:a', 'copy',
        output_path
    ]
    subprocess.run(cmd)
