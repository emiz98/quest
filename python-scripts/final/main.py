import threading
from flashcard import flash_card
from chatbot import chat_bot
from utility import speechToText, rotate_head
from facedetection import head_function

activity_commands = [
    "flashcard",
    "flash",
    "card",
    "flashcards",
    "flash card",
    "flash cards",
]


def isActivity(word):
    for i in range(len(activity_commands)):
        if (
            word.lower() in activity_commands[i].lower()
            or activity_commands[i].lower() in word.lower()
        ):
            return True
    return False


# while True:
#     user_query = speechToText()
#     if isActivity(user_query):
#         flash_card()
#     else:
#         chat_bot(user_query)


stop_event = threading.Event()


def main_func(stop_event):
    while not stop_event.is_set():
        user_query = speechToText()
        if isActivity(user_query):
            stop_event.set()
            flash_card()
        else:
            chat_bot(user_query)


thread2 = threading.Thread(target=main_func, args=(stop_event,))
thread3 = threading.Thread(target=head_function, args=(stop_event,))

thread2.start()
thread3.start()

thread2.join()
thread3.join()
