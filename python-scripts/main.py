import cv2
from pyzbar.pyzbar import decode
import random
import requests
import time
from text_to_speech import text2speech
from speech_to_text import speechToText

url = 'http://192.168.1.32:5005/webhooks/rest/webhook'
socketUrl = 'http://192.168.1.32:8000/send'

words = ["Can you show me ", "Show me ", "I'd like to see ",
         "Would you be able to show me ", "I'm interested in seeing ",
         "Would you mind showing me "]


def speak(word):
    response = requests.post(socketUrl, json=word, headers={
                             'Content-Type': 'application/json'})
    text2speech(word['phrase'], 0)


def starts_with_vowel(word):
    if word.endswith('s'):
        return ""+word
    elif word.lower().startswith(('a', 'e', 'i', 'o', 'u')):
        return "an "+word
    else:
        return "a "+word


def activity_index(arr, word):
    for i in range(len(arr)):
        if word.lower() in arr[i]["title"].split(" ")[1].lower():
            return i
    return -1


def identify_object():
    cap = cv2.VideoCapture('http://192.168.1.11:8080/video')
    cv2.namedWindow('Result', cv2.WINDOW_NORMAL)
    cv2.resizeWindow('Result', 680, 500)

    varBreak = True
    while varBreak:
        success, img = cap.read()

        for barcode in decode(img):
            data = barcode.data.decode('utf-8')
            # pts = np.array([barcode.polygon], np.int32)
            # pts = pts.reshape((-1, 1, 2))
            # cv2.polylines(img, [pts], True, (255, 0, 0), 5)
            # cv2.putText(img, data, (barcode.rect[0], barcode.rect[1]),cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

            if (data):
                print(data)
                varBreak = False
                cv2.destroyAllWindows()
                return data

        cv2.imshow('Result', img)
        cv2.waitKey(1)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            cv2.destroyAllWindows()
            break


# while True:
#     requests.get(socketUrl+speechToText())
#     input("Press Enter to continue...")
#     break


r1 = requests.get("https://quest-alpha.vercel.app/api/activity/all")
activityData = r1.json()['data']
activityIndex = -1
talk = {
    "phrase": "Can you choose an activity.",
    "animation": "talk"
}
speak(talk)

while True:
    activityChosen = "Fruit"
    # activityChosen = speechToText()
    tempIndex = activity_index(activityData, activityChosen)
    if tempIndex == -1:
        talk = {
            "phrase": "There is no such kind of activity. Can you choose another activity.",
            "animation": "talk"
        }
        speak(talk)
    else:
        activityIndex = tempIndex
        break

r2 = requests.get(
    f"https://quest-alpha.vercel.app/api/card/all?actID={activityData[activityIndex]['_id']}")
flashCards = r2.json()['data']

for i in range(10):
    phrase = random.choice(words)+starts_with_vowel(flashCards[i]['title'])+"."
    talk = {
        "phrase": phrase,
        "animation": "talk"
    }
    speak(talk)

    hintNum = 0
    while True:
        identified_object = identify_object()

        if (flashCards[i]['title'].lower() == identified_object.lower()):
            phrase = f"Good Job. You've found {flashCards[i]['title']}."
            talk = {
                "phrase": phrase,
                "animation": "happy"
            }
            speak(talk)
            time.sleep(1)
            break
        else:
            phrase = f"That's incorrect. Thats {starts_with_vowel(identified_object)}."
            talk = {
                "phrase": phrase,
                "animation": "wrong"
            }
            speak(talk)

            if (hintNum == 3 or flashCards[i]['hints'][hintNum] == ""):
                phrase = f"Looks like you have trouble with finding {starts_with_vowel(flashCards[i]['title'])}. Don't worry I will show you."
                talk = {
                    "phrase": phrase,
                    "animation": "giveup",
                    "id": flashCards[i]['_id']
                }
                speak(talk)
                break

            else:
                phrase = f"I will give you a hint. {flashCards[i]['hints'][hintNum]} Try showing me {starts_with_vowel(flashCards[i]['title'])} again."
                talk = {
                    "phrase": phrase,
                    "animation": "wrong"
                }
                speak(talk)
                hintNum = hintNum+1
            time.sleep(1)
