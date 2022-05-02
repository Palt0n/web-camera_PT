import cv2
import os

MJPEG_ADDRESS = os.environ.get("MJPEG_ADDRESS")
MJPEG_PORT = os.environ.get("MJPEG_PORT")

assert MJPEG_ADDRESS
assert MJPEG_PORT

cap = cv2.VideoCapture('http://{}:{}/frame.mjpg'.format(MJPEG_ADDRESS, MJPEG_PORT))

while True:
  ret, frame = cap.read()
  cv2.imshow('Video', frame)

  if cv2.waitKey(1) == 27:
    exit(0)