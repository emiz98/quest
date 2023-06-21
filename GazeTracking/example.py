"""
Demonstration of the GazeTracking library.
Check the README.md for complete documentation.
"""

import cv2
import imutils
import matplotlib.pyplot as plt
from gaze_tracking import GazeTracking

gaze = GazeTracking()
# webcam = cv2.VideoCapture("http://192.168.1.7:8080/video")

# Load the video clip
video_path = "./videos/teacher/8R.mp4"
# video_path = "./videos/robot/1R.mp4"
webcam = cv2.VideoCapture(video_path)

# Get the total number of frames
frame_count = int(webcam.get(cv2.CAP_PROP_FRAME_COUNT))

frame_width = int(webcam.get(cv2.CAP_PROP_FRAME_WIDTH))
frame_height = int(webcam.get(cv2.CAP_PROP_FRAME_HEIGHT))

print("Frame width:", frame_width)
print("Frame height:", frame_height)


fig, ax = plt.subplots()
plt.xlabel("X-axis")
plt.ylabel("Y-axis")
plt.title("Plot of Coordinates")
# plt.xlim(0.2, 0.6)
# plt.ylim(0.3, 0.5)
# plt.xlim(0.4, 0.6)
# plt.ylim(0.2, 0.6)

x = []
y = []

# calibrate centroid of eye ball
# deltaX = 0.05
# deltaY = 0.1
deltaX = 0.02
deltaY = 0.04

while True:
    # We get a new frame from the webcam
    _, frame = webcam.read()

    # frame = imutils.resize(frame, width=1200)

    # We send this frame to GazeTracking to analyze it
    gaze.refresh(frame)

    frame = gaze.annotated_frame()
    text = ""

    if gaze.is_blinking():
        text = "Blinking"
    elif gaze.is_right():
        text = "Looking right"
    elif gaze.is_left():
        text = "Looking left"
    elif gaze.is_center():
        text = "Looking center"

    # cv2.putText(frame, text, (90, 60), cv2.FONT_HERSHEY_DUPLEX, 1.6, (147, 58, 31), 2)

    left_pupil = gaze.pupil_left_coords()
    right_pupil = gaze.pupil_right_coords()

    if left_pupil != None:
        normalized_eye_coordinates = (
            (((left_pupil[0] / frame_width) + (right_pupil[0] / frame_width)) / 2)
            + deltaX,
            (((left_pupil[1] / frame_height) + (right_pupil[1] / frame_height)) / 2)
            + deltaY,
        )
        x.append(normalized_eye_coordinates[0])
        y.append(normalized_eye_coordinates[1])
        print(normalized_eye_coordinates)
        plt.plot(normalized_eye_coordinates[0], normalized_eye_coordinates[1], "o")
        plt.pause(0.001)

    # cv2.putText(
    #     frame,
    #     "Left pupil:  " + str(left_pupil),
    #     (90, 130),
    #     cv2.FONT_HERSHEY_DUPLEX,
    #     0.9,
    #     (147, 58, 31),
    #     1,
    # )
    # cv2.putText(
    #     frame,
    #     "Right pupil: " + str(right_pupil),
    #     (90, 165),
    #     cv2.FONT_HERSHEY_DUPLEX,
    #     0.9,
    #     (147, 58, 31),
    #     1,
    # )

    # print(right_pupil)

    cv2.imshow("Demo", frame)

    if cv2.waitKey(1) == 27:
        break

webcam.release()
cv2.destroyAllWindows()

# plt.plot(x, y, "o")
# plt.xlabel("X-axis")
# plt.ylabel("Y-axis")
# plt.title("Plot of Coordinates")
# plt.xlim(0.45, 0.55)
# plt.ylim(0.47, 0.53)
