import speech_recognition as sr
import text_to_speech as t2p
import requests

url = 'http://192.168.1.32:5005/webhooks/rest/webhook'
socketUrl = 'http://192.168.1.32:8000/send/'


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


while True:
    # t2p.text2speech(speechToText())
    requests.get(socketUrl+speechToText())
    input("Press Enter to continue...")


# r = requests.get("http://localhost:3000/api/activity/all")
# data = r.json()['data']

# text = "There is plenty of activities to try like... " + data[0]['title']+". "+data[1]['title']+". "+data[2]['title'] + \
#     ". "+data[3]['title']+". "+data[4]['title']+". " + \
#     data[5]['title']+". Which one do you prefer?"
# requests.get(socketUrl+text)

# r2 = requests.get(
#     "http://localhost:3000/api/card/all?actID=63ac9f81625b23544269bfb7")
# data2 = r2.json()['data']
# rand2 = random.randint(0, len(data2)-1)
# text2 = "Great. Can you show me a " + data2[rand2]['title']
# requests.get(socketUrl+text2)
