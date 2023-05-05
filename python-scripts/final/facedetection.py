import cv2
import sys
import imutils
import requests
import numpy as np

# Load the pre-trained face detection model
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

# Start the video capture
cap = cv2.VideoCapture('http://192.168.1.7:8080/video')

# Some constants
boundary_delta = 250
global_x_coordinate = 90
frame_count = 0
global_x_coordinate_arr = [90, 90]

requests.get(url='http://192.168.1.41',
                 params={'q': str(90)})


def send_data(data):
    requests.get(url='http://192.168.1.41',
                 params={'q': str(180-data)})


while True:
    # Read a frame from the video capture
    ret, frame = cap.read()

    # Convert the frame to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces in the grayscale frame
    faces = face_cascade.detectMultiScale(
        gray, scaleFactor=2.5, minNeighbors=1)

    # Split the window into three sections
    width = frame.shape[1]
    section_width = width // 3
    left_boundary = section_width + boundary_delta
    right_boundary = section_width * 2 - boundary_delta

    # Draw dividing lines for the sections
    cv2.line(frame, (left_boundary, 0),
             (left_boundary, frame.shape[0]), (255, 0, 0), 2)
    cv2.line(frame, (right_boundary, 0),
             (right_boundary, frame.shape[0]), (255, 0, 0), 2)

    # Draw a semi-transparent rectangle over the middle section
    alpha = 0.1  # Set the opacity of the rectangle
    overlay = frame.copy()
    cv2.rectangle(overlay, (left_boundary, 0),
                  (right_boundary, frame.shape[0]), (255, 255, 255), -1)
    cv2.addWeighted(overlay, alpha, frame, 1 - alpha, 0, frame)

    # Loop through the detected faces
    for (x, y, w, h) in faces:
        frame_count += 1
        if (frame_count % 10 == 0):
            if global_x_coordinate_arr[-1] != global_x_coordinate_arr[-2]:
                send_data(global_x_coordinate)

        # Determine which section the face is in
        if x + w < left_boundary:
            if (global_x_coordinate > 0):
                # print("Left: " + str(global_x_coordinate))
                global_x_coordinate -= 1

                global_x_coordinate_arr.append(global_x_coordinate)
                global_x_coordinate_arr.pop(0)

        elif x > right_boundary:
            if (global_x_coordinate < 180):
                # print("Right: " + str(global_x_coordinate))
                global_x_coordinate += 1

                global_x_coordinate_arr.append(global_x_coordinate)
                global_x_coordinate_arr.pop(0)

        else:
            print(global_x_coordinate)

        # Draw a rectangle around the detected face
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

    # Display the frame
    cv2.imshow('frame', imutils.resize(frame, width=600))

    # Check for the 'q' key to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        sys.exit()

# Release the video capture and close the window
cap.release()
cv2.destroyAllWindows()
