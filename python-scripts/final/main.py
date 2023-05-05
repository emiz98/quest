from flashcard import flash_card
from chatbot import chat_bot
from utility import speechToText


while True:
    user_query = speechToText()
    if "community activities" in user_query.lower() or "community activity" in user_query.lower():
        flash_card()
    else:
        chat_bot(user_query)
