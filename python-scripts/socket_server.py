from flask import Flask
from flask_socketio import SocketIO, send

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")


@socketio.on('connect')
def handle_connect():
    print('Client connected')


@socketio.on("/send")
def sendMessage(message):
    send({"msg": message}, broadcast=True)
    return message


if __name__ == "__main__":
    app.run(debug=True)
