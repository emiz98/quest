import cv2
import imutils
import math
import time
import random
import opr
import requests

URL = 'http://192.168.1.41'
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
# cap = cv2.VideoCapture('http://192.168.1.36:81/stream')
cap = cv2.VideoCapture('http://192.168.1.7:8080/video')

# cv2.namedWindow("Frame", cv2.WINDOW_AUTOSIZE)
windowWidth = 600

reset = True

# while cap.isOpened():
#     # Read the frame
#     _, frame = cap.read()
#     frame = imutils.resize(frame, width=windowWidth)

#     # Convert to grayscale
#     gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

#     # Detect the faces
#     faces = face_cascade.detectMultiScale(gray, 1.2, 5)

#     # Frame divider
#     cv2.line(frame, (200, 0), (200, 600), (0, 255, 0), 1)
#     cv2.line(frame, (400, 0), (400, 600), (0, 255, 0), 1)

#     if (len(faces) == 0 and reset):
#         # requests.get(url=URL, params={'q': str(90)})
#         print("reset")
#         reset = False

#     # Draw the rectangle around each face
#     for (x, y, w, h) in faces:
#         reset = True
#         x_medium = int((x+x+w)/2)
#         y_medium = int((y+y+h)/2)
#         value = 180-int((x_medium/windowWidth)*180)

#         cv2.circle(frame, (x_medium, y_medium), 10, (0, 0, 255), 2)
#         # cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

#         print(value)
#         # try:
#         #     requests.get(url=URL, params={'q': str(value)})
#         # except:
#         #     continue

#     # Display
#     cv2.imshow('Frame', frame)
#     # cv2.imshow('Frame2', frame2)

#     # Stop if escape key is pressed
#     k = cv2.waitKey(30) & 0xff
#     if k == 27:
#         break

# # Release the VideoCapture object
# cap.release()
# cv2.destroyAllWindows()


class App():
    def __init__(self):
        super().__init__()
        # allow mouse tracking(use during manual mode)
        # self.setMouseTracking(True)
        self.manual_mode = False  # set manual mode to false to start in tracking face mode
        self.LED_ON = True  # set LED on mode
        # define camera ID, first camera = ID 0, second ID 1 and so on
        self.CameraID = 'http://192.168.1.7:8080/video'

        self.rec = True  # allows to start camera recording
        # define open CV camera recording
        self.cap = cv2.VideoCapture(self.CameraID)
        self.cap.set(3, 960)  # set capture width
        self.cap.set(4, 540)  # set capture height
        # The bigger the image is, the longer the processing is goint to take to process it
        # My computer is a bit shit so I kept it quite small .

        self.min_tilt = 22  # minimum tilt angle in degree (up/down angle)
        self.max_tilt = 80  # maximum tilt angle in degree
        # current tilt (info received from arduino and displayed in LCD numbers)
        self.current_tilt = 0
        self.target_tilt = 90  # the tilt angle you need to reach
        self.TiltSensivity = 1

        self.min_pan = 0  # minimum pan angle in degree(left/ right angle)
        self.max_pan = 180  # maximum pan angle in degree
        # current pan (info received from arduino and displayed in LCD numbers)
        self.current_pan = 90
        self.target_pan = 90  # the pan angle you need to reach
        self.PanSensivity = 1

        self.roam_target_pan = 90
        self.roam_target_tilt = 90
        # amount of frame the camera is going to pause for when roam tilt or pan target reached
        self.roam_pause = 40
        self.roam_pause_count = self.roam_pause  # current pause frame count

        self.is_connected = False  # boolean defining if arduino is connected

        self.InvertPan = False  # allows pan to be inverted
        self.InvertTilt = False  # allows tilt to be inverted

        self.face_detected = False  # define if a face is detected
        # define if detected face is close enough to the center of the captured image
        self.target_locked = False
        # minimum distance between face/center of image for setting target locked
        self.max_target_distance = 40
        # number of empty frame (no face detected) detected before starting roaming
        self.max_empty_frame = 50
        self.empty_frame_number = self.max_empty_frame  # current empty frame count
        requests.get(url=URL, params={'q': str(self.target_pan)})
        self.record()

    def calculate_camera_move(self, distance_X, distance_Y):

        # self.target_pan += distance_X * self.PanSensivity

        if (self.InvertPan):  # handle inverted pan
            self.target_pan -= distance_X * self.PanSensivity
            if (self.target_pan > self.min_pan):
                self.target_pan = self.min_pan
            elif (self.target_pan < self.max_pan):
                self.target_pan = self.max_pan

        else:
            self.target_pan += distance_X * self.PanSensivity
            if (self.target_pan > self.max_pan):
                self.target_pan = self.max_pan
            elif (self.target_pan < self.min_pan):
                self.target_pan = self.min_pan

        # self.target_tilt += distance_Y * self.TiltSensivity

        if (self.InvertTilt):  # handle inverted tilt
            self.target_tilt -= distance_Y * self.TiltSensivity
            if (self.target_tilt > self.min_tilt):
                self.target_tilt = self.min_tilt
            elif (self.target_tilt < self.max_tilt):
                self.target_tilt = self.max_tilt
        else:
            self.target_tilt += distance_Y * self.TiltSensivity
            if (self.target_tilt > self.max_tilt):
                self.target_tilt = self.max_tilt
            elif (self.target_tilt < self.min_tilt):
                self.target_tilt = self.min_tilt

    def roam(self):
        if (self.roam_pause_count < 0):  # if roam count inferior to 0

            self.roam_pause_count = self.roam_pause  # reset roam count
            self.roam_target_pan = int(
                random.uniform(self.min_pan, self.max_pan))
            self.roam_target_tilt = int(
                random.uniform(self.min_tilt, self.max_tilt))

        else:  # if roam count > 1
            # increment pan target toward roam target
            if (int(self.target_pan) > self.roam_target_pan):
                self.target_pan -= 1
            elif (int(self.target_pan) < self.roam_target_pan):
                self.target_pan += 1
            else:  # if roam target reached decrease roam pause count
                self.roam_pause_count -= 1

            if (int(self.target_tilt) > self.roam_target_tilt):
                self.target_tilt -= 1
            elif (int(self.target_tilt) < self.roam_target_tilt):
                self.target_tilt += 1
            else:
                self.roam_pause_count -= 1

    def image_process(self, img):  # handle the image processing
        # to add later : introduce frame scipping (check only 1 every nframe)
        # try to find face and return processed image
        processed_img = opr.find_face(img, self.max_target_distance)
        # if face found during processing , the data return will be as following :
        # [True, image_to_check, distance_from_center_X, distance_from_center_Y, locked]
        # if not it will just retun False

        if (processed_img[0]):  # if face found
            self.face_detected = True
            self.empty_frame_number = self.max_empty_frame  # reset empty frame count
            self.target_locked = processed_img[4]
            # calculate new targets depending on distance between face and image center
            self.calculate_camera_move(processed_img[2], processed_img[3])
            return processed_img[1]
        else:
            self.face_detected = False
            self.target_locked = False
            # self.target_pan = 90
            if (self.empty_frame_number > 0):
                self.empty_frame_number -= 1  # decrease frame count until it equal 0
            else:
                print("Roaming")
                # self.roam()  # then roam
            return img

    def record(self):  # video recording
        while (self.rec):
            _, img = cap.read()  # CAPTURE IMAGE
            processed_img = self.image_process(img)
            frame = imutils.resize(processed_img, width=windowWidth)
            cv2.imshow('Frame', frame)  # update image in window
            print(self.target_pan)
            requests.get(url=URL, params={'q': str(180-self.target_pan)})

            # self.move_servos()  # move servos

            if (not self.rec):  # allows while loop to stop if pause button pressed
                break
            k = cv2.waitKey(30) & 0xff  # Stop if escape key is pressed
            if k == 27:
                requests.get(url=URL, params={'q': str(90)})
                break


if __name__ == '__main__':
    App()
