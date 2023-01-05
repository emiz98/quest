import speech_recognition as sr
import text_to_speech as t2p
import requests

url = 'http://192.168.1.32:5005/webhooks/rest/webhook'


def speechToText():
    r = sr.Recognizer()
    query = ""
    try:
        with sr.Microphone() as mic:
            print("Listening...")
            r.pause_threshold = 2
            r.adjust_for_ambient_noise(mic, duration=0.2)
            audio = r.listen(mic)

            print("Recognizing...")
            query = r.recognize_google(audio, language='en-US')
            print(f"User said: {query}")
            obj = {
                "sender": "test_user",
                "message": query
            }
            r = requests.post(url, json=obj)
            data = r.json()
            query = data[0]['text']
    except Exception as e:
        pass
    return query
