import cv2
import os
from image_processing import preprocess_image, draw_contours
from quickdraws import get_predictions
import time

cap = cv2.VideoCapture('http://192.168.1.7:8080/video')
cv2.namedWindow('Original', cv2.WINDOW_NORMAL)
cv2.resizeWindow('Original', 680, 500)
cv2.namedWindow('Contour', cv2.WINDOW_NORMAL)
cv2.resizeWindow('Contour', 680, 500)
cv2.namedWindow('Processed', cv2.WINDOW_NORMAL)
cv2.resizeWindow('Processed', 680, 500)

while True:
    _, frame = cap.read()  # Capture a frame from the webcam

    contour_path = draw_contours(frame)
    processed_path = preprocess_image(contour_path)

    # Display the original frame and the filtered frame
    contour_image = cv2.imread(f'{os.getcwd()}/images/contour.jpg')
    processed_image = cv2.imread(f'{os.getcwd()}/images/processed.jpg')

    cv2.imshow('Original', frame)
    cv2.imshow('Contour', contour_image)
    cv2.imshow('Processed', processed_image)

    if cv2.waitKey(1) == 13:  # Check if the user pressed 'Enter' to capture
        cv2.imwrite(f'{os.getcwd()}/images/original.jpg', frame)
        get_predictions(processed_image)
        time.sleep(5)

    if cv2.waitKey(1) == ord('q'):  # Check if the user pressed 'q' to quit
        break

cv2.destroyAllWindows()
