import cv2
import numpy as np
from tensorflow import keras
import os
import time

model_folder = f"{os.getcwd()}/model"

# Read class names
with open(f"{model_folder}/class_names.txt", "r") as ins:
    class_names = []
    for line in ins:
        class_names.append(line.rstrip('\n'))


model = keras.models.load_model(f'{model_folder}/model.h5')  # Load the model
# model.summary()


def preprocess_image(contour_path):
    img = cv2.imread(contour_path)  # open contour image
    kernel = np.ones((12, 12), np.uint8)  # create kernel
    # Convert the image to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (3, 3), 0)  # Apply Gaussian blur
    edges = cv2.Canny(blur, 50, 150)  # Run Canny edge detection
    edges = cv2.dilate(edges, None)  # Dilate the edges
    edges = cv2.bitwise_not(edges)  # Invert the colors of the image
    m = cv2.morphologyEx(edges, cv2.MORPH_GRADIENT, kernel)
    image_complement = 255 - m  # Complement of the image

    processed_path = "images/processed.jpg"
    cv2.imwrite(processed_path, image_complement)

    return processed_path


def draw_contours(image):
    # image = cv2.imread(image)  # Load the image
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  # Convert to grayscale
    gray = cv2.GaussianBlur(gray, (3, 3), 0)  # Blur the image to reduce noise
    edges = cv2.Canny(gray, 100, 50, apertureSize=3)  # Detect edges
    contours, hierarchy = cv2.findContours(
        edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)  # Find contours

    # Create a blank image with the same size as the original image
    blank_image = np.zeros((558, 560, 3))

    # Find the contour with the largest area
    cx = max(contours, key=cv2.contourArea)
    scaled_contours = [(((c / 1200) * 560)).astype(int) for c in cx]
    shifted_contours = [c + np.array([-100, 0]) for c in scaled_contours]
    cv2.drawContours(blank_image, shifted_contours, -1, (255, 255, 255), 2)

    # # Draw the contour on the original image
    # cv2.drawContours(blank_image, [c], -1, (255, 255, 255), 2)

    flipped_image = cv2.flip(blank_image, 1)

    contour_path = "images/contour.jpg"
    cv2.imwrite(contour_path, blank_image)

    return contour_path


def get_predictions(image_path, predict_count=5):
    # contour_path = draw_contours(f"{os.getcwd()}/{image_path}")
    # processed_path = preprocess_image(contour_path)

    # img = cv2.imread(processed_path)
    # img = cv2.imread('images/umbrella.png')

    img = cv2.resize(image_path, (64, 64))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img = img.reshape((64, 64, 1))
    img = (255 - img) / 255

    # predict
    pred = model.predict(np.expand_dims(img, axis=0))[0]
    ind = (-pred).argsort()[:predict_count]
    latex = [class_names[x] for x in ind]

    percentages = pred / np.sum(pred) * 100

    # plt.imshow(img.squeeze())
    # plt.show()
    print(latex)
    return latex, percentages, img.squeeze()


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
        get_predictions(processed_image, 5)
        time.sleep(2)

    if cv2.waitKey(1) == ord('q'):  # Check if the user pressed 'q' to quit
        break

cv2.destroyAllWindows()
