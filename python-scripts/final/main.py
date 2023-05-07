import threading
from flashcard import flash_card
from chatbot import chat_bot
from utility import speechToText, rotate_head
from facedetection import head_function

# while True:
#     user_query = speechToText()
#     if user_query.lower() in activity_commands:
#         flash_card()
#     else:
#         chat_bot(user_query)


stop_event = threading.Event()
activity_commands = ["community"]


def main_func(stop_event):
    while not stop_event.is_set():
        user_query = speechToText()
        if user_query.lower() in activity_commands:
            stop_event.set()
            rotate_head(90)
            flash_card()
        else:
            chat_bot(user_query)


thread2 = threading.Thread(target=main_func, args=(stop_event,))
thread3 = threading.Thread(target=head_function, args=(stop_event,))

thread2.start()
thread3.start()

thread2.join()
thread3.join()
