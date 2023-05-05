import requests
from utility import speak

url = 'http://192.168.1.32:5005/webhooks/rest/webhook'


def rasaResponse(word):
    obj = {
        "sender": "test_user",
        "message": word
    }
    r = requests.post(url, json=obj)
    data = r.json()
    query = data[0]['text']
    return query


def chat_bot(user_query):
    obj = {
        "phrase": rasaResponse(user_query),
        "animation": "talk"
    }
    speak(obj)
