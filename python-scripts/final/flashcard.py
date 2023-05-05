import cv2
from pyzbar.pyzbar import decode
import requests
from utility import speak
from enum import Enum
import random


def starts_with_vowel(word):
    if word.endswith('s'):
        return ""+word
    elif word.lower().startswith(('a', 'e', 'i', 'o', 'u')):
        return "an "+word
    else:
        return "a "+word


def activity_index(arr, word):
    for i in range(len(arr)):
        if word.lower() in arr[i]["title"].lower() or arr[i]["title"].lower() in word.lower():
            return i
    return -1


def identify_object():
    cap = cv2.VideoCapture('http://192.168.1.7:8080/video')
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


def flash_card():
    class Animation(str, Enum):
        IDLE = 'idle',
        TALK = 'talk',
        HAPPY = 'happy',
        WRONG = 'wrong',
        CUDDLE = 'cuddle',
        GIVEUP = 'giveup',
        ACTIVITY = 'activity'

    words = ["Can you show me ", "Show me ", "I'd like to see ",
             "Would you be able to show me ", "I'm interested in seeing ",
             "Would you mind showing me "]

    r1 = requests.get("https://quest-alpha.vercel.app/api/activity/all")
    activity_data = r1.json()['data']
    activityIndex = -1

    talk = {
        "phrase": "Great! What activity would you like?",
        "animation": Animation.ACTIVITY.value,
    }
    speak(talk)

    while True:
        activityChosen = 'fruits'
        # activityChosen = speechToText()
        tempIndex = activity_index(activity_data, activityChosen)
        print(tempIndex)
        if tempIndex == -1:
            talk = {
                "phrase": "There is no such kind of activity. Can you choose another activity.",
                "animation": Animation.ACTIVITY.value
            }
            speak(talk)
        else:
            activityIndex = tempIndex
            talk = {
                "phrase": "Awesome choice! Let's play.",
                "animation": Animation.IDLE.value
            }
            speak(talk)
            break

    r2 = requests.get(
        f"https://quest-alpha.vercel.app/api/card/all?actID={activity_data[activityIndex]['_id']}")
    flashCards = r2.json()['data']

    for i in range(len(flashCards)):
        phrase = random.choice(
            words)+starts_with_vowel(flashCards[i]['title'])+"."
        talk = {
            "phrase": phrase,
            "animation": Animation.TALK.value
        }
        speak(talk)

        hintNum = 0
        while True:
            identified_object = identify_object()
            print(identified_object)

            if (flashCards[i]['title'].lower() == identified_object.lower()):
                phrase = f"Good Job. You've found {flashCards[i]['title']}."
                talk = {
                    "phrase": phrase,
                    "animation": Animation.HAPPY.value
                }
                speak(talk)
                break
            else:
                phrase = f"That's incorrect. Thats {starts_with_vowel(identified_object)}."
                talk = {
                    "phrase": phrase,
                    "animation": Animation.WRONG.value
                }
                speak(talk)

                if (hintNum == 3 or flashCards[i]['hints'][hintNum] == ""):
                    phrase = f"Looks like you have trouble with finding {starts_with_vowel(flashCards[i]['title'])}."
                    talk = {
                        "phrase": phrase,
                        "animation": Animation.GIVEUP.value,
                        "id": flashCards[i]['_id']
                    }
                    speak(talk)
                    break

                else:
                    phrase = f"I will give you a hint. {flashCards[i]['hints'][hintNum]} Try showing me {starts_with_vowel(flashCards[i]['title'])} again."
                    talk = {
                        "phrase": phrase,
                        "animation": Animation.WRONG.value
                    }
                    speak(talk, int(len(flashCards[0]['hints'][1])/6))
                    hintNum = hintNum+1
