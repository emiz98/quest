import cv2
import numpy as np
from pyzbar.pyzbar import decode

# img = cv2.imread('qr.png')
# cap = cv2.VideoCapture('http://192.168.1.7:8080/video')
cap = cv2.VideoCapture("http://192.168.1.35:81/stream")

while True:
    success, img = cap.read()
    for barcode in decode(img):
        data = barcode.data.decode('utf-8')
        pts = np.array([barcode.polygon], np.int32)
        pts = pts.reshape((-1, 1, 2))
        cv2.polylines(img, [pts], True, (255, 0, 0), 5)
        cv2.putText(img, data, (barcode.rect[0], barcode.rect[1]),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    cv2.imshow('Result', img)
    cv2.waitKey(1)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        cv2.destroyAllWindows()
        break
