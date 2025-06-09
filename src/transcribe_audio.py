from vosk import Model, KaldiRecognizer
import wave
import json

def transcribe_audio(audio_path, model_path):
    wf = wave.open(audio_path, "rb")
    model = Model(model_path)
    rec = KaldiRecognizer(model, wf.getframerate())

    results = []
    while True:
        data = wf.readframes(4000)
        if len(data) == 0:
            break
        if rec.AcceptWaveform(data):
            res = json.loads(rec.Result())
            results.append(res.get('text', ''))
    # Final result
    res = json.loads(rec.FinalResult())
    results.append(res.get('text', ''))

    return ' '.join(results)
