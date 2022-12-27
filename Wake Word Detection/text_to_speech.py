import pyttsx3


def text2speech(text):
    engine = pyttsx3.init()  # initialize Text-to-speech engine
    voices = engine.getProperty("voices")  # Get available voices
    engine.setProperty("voice", voices[1].id)  # Set voice to what we want
    engine.setProperty("rate", 150)
    engine.say(f'<pitch middle="10">{text}</pitch>')
    # engine.say(text)  # play the speech
    engine.runAndWait()
