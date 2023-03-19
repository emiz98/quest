import matplotlib.pyplot as plt
import cv2
import numpy as np
from tensorflow import keras
# from image_processing import preprocess_image, draw_contours
import os

model_folder = f"{os.getcwd()}/models/model5"

# Read class names
with open(f"{model_folder}/class_names.txt", "r") as ins:
    class_names = []
    for line in ins:
        class_names.append(line.rstrip('\n'))


model = keras.models.load_model(f'{model_folder}/model.h5')  # Load the model
# model.summary()


def get_predictions(image_path):
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
    ind = (-pred).argsort()[:5]
    latex = [class_names[x] for x in ind]

    percentages = pred / np.sum(pred) * 100

    # plt.imshow(img.squeeze())
    # plt.show()
    print(latex)
    return latex, percentages, img.squeeze()


test = False
if (test):
    img = cv2.imread(f'{os.getcwd()}/images/church.png')
    latex, percentages, squeezed_image = get_predictions(img)

    max_percentages = []
    for i in range(5):
        index = np.argmax(percentages)  # Get the index of the maximum element
        max_percentages.append(percentages[index])

        # Remove the maximum element from the array
        percentages = np.delete(percentages, index)

    print(max_percentages)

    plt.subplot(2, 2, 1)
    plt.imshow(img)
    plt.subplot(2, 2, 3)
    plt.imshow(squeezed_image)

    plt.subplot(2, 2, 2)
    y = max_percentages
    plt.pie(y, labels=latex, autopct='%1.1f%%')
    plt.show()
