import cv2
import numpy as np
import matplotlib.pyplot as plt
from quickdraws import get_predictions


def plot_before_after(img1, img2, img3):
    fig, (ax1, ax2, ax3) = plt.subplots(1, 3)

    # Display the first image in the top subplot
    ax1.imshow(img1)
    ax1.axis('off')

    # Display the second image in the bottom subplot
    ax2.imshow(img2)
    ax2.axis('off')

    # Display the third image in the bottom subplot
    ax3.imshow(img3)
    ax3.axis('off')

    # Show the figure
    plt.show()


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
    edges = cv2.Canny(gray, 50, 150, apertureSize=3)  # Detect edges
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


test = True
if (test):
    original = cv2.imread("images/original.jpg")
    contour = cv2.imread(draw_contours(original))
    processed = cv2.imread(preprocess_image("images/contour.jpg"))

    get_predictions(cv2.imread("images/processed.jpg"))

    # plot_before_after(cv2.imread(original), cv2.imread(
    #     original), cv2.imread(original))
    cv2.namedWindow('original', cv2.WINDOW_NORMAL)
    cv2.resizeWindow('original', 680, 500)
    cv2.namedWindow('contour', cv2.WINDOW_NORMAL)
    cv2.resizeWindow('contour', 680, 500)
    cv2.namedWindow('processed', cv2.WINDOW_NORMAL)
    cv2.resizeWindow('processed', 680, 500)

    cv2.imshow('original', original)
    cv2.imshow('contour', contour)
    cv2.imshow('processed', processed)
    cv2.waitKey(0)
