import time
import re
import requests
import speech_recognition as sr
from pocketsphinx import LiveSpeech

socketUrl = "http://192.168.1.32:8000/send"
nodemcuUrl = "http://192.168.1.41"


def contains_number(string):
    pattern = r"\d+"
    return bool(re.search(pattern, string))


def rotate_head(angle):
    requests.get(url=nodemcuUrl, params={"q": str(180 - angle)})


def happy_anim():
    requests.get(url=nodemcuUrl + "/happy")


def sad_anim():
    requests.get(url=nodemcuUrl + "/sad")


def speak(obj, sleep=4):
    requests.post(socketUrl, json=obj, headers={"Content-Type": "application/json"})
    time.sleep(sleep)


def speechToTextSphinx():
    for phrase in LiveSpeech():
        print(phrase)
        return phrase
    else:
        print("Sorry! could not recognize what you said")


def speechToText():
    r = sr.Recognizer()
    query = ""
    try:
        with sr.Microphone() as mic:
            print("Listening...")
            r.adjust_for_ambient_noise(mic, duration=0.6)
            audio = r.listen(mic)
            print("Recognizing...")
            query = r.recognize_google(audio, language="en-US")
            print(query)
    except Exception as e:
        pass
    return query
