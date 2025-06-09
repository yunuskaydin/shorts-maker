import srt
from datetime import timedelta

def generate_srt(transcript_text, output_srt_path):
    lines = transcript_text.split('. ')
    subs = []
    for i, line in enumerate(lines):
        start = timedelta(seconds=i*2)
        end = timedelta(seconds=(i+1)*2)
        subs.append(srt.Subtitle(index=i+1, start=start, end=end, content=line))
    
    with open(output_srt_path, 'w') as f:
        f.write(srt.compose(subs))
