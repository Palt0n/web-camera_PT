#Import necessary libraries
from flask import Flask, render_template, Response, request
import cv2
import os
import time
import json

MQTT_BROKER_ADDRESS = os.environ.get("MQTT_BROKER_ADDRESS")
MQTT_BROKER_PORT = os.environ.get("MQTT_BROKER_PORT")
MQTT_BROKER_WEBSOCKET_PORT = os.environ.get("MQTT_BROKER_WEBSOCKET_PORT")
MQTT_BROKER_USER = os.environ.get("MQTT_BROKER_USER")
MQTT_BROKER_PASSWORD = os.environ.get("MQTT_BROKER_PASSWORD")
MQTT_TOPIC = os.environ.get("MQTT_TOPIC")
MQTT_CLIENT_NAME = os.environ.get("MQTT_CLIENT_NAME")
assert MQTT_BROKER_ADDRESS
assert MQTT_BROKER_PORT
assert MQTT_BROKER_USER
assert MQTT_BROKER_PASSWORD
assert MQTT_TOPIC
MQTT_BROKER_PORT = int(MQTT_BROKER_PORT)
broker_address = MQTT_BROKER_ADDRESS
port = MQTT_BROKER_PORT
user = MQTT_BROKER_USER
password = MQTT_BROKER_PASSWORD

MQTT_TOPIC_CAMERA = MQTT_TOPIC + "/camera"
MQTT_TOPIC_CAMERA_MOVE = MQTT_TOPIC + "/camera_move"

MJPEG_ADDRESS = os.environ.get("MJPEG_ADDRESS")
MJPEG_PORT = os.environ.get("MJPEG_PORT")

assert MJPEG_ADDRESS
assert MJPEG_PORT
#Initialize the Flask app
app = Flask(__name__)
# 
'''
for ip camera use - rtsp://username:password@ip_address:554/user=username_password='password'_channel=channel_number_stream=0.sdp' 
for local webcam use cv2.VideoCapture(0)
'''
cap = None
def gen_frames():
    global cap
    cap = cv2.VideoCapture('http://{}:{}/frame.mjpg'.format(MJPEG_ADDRESS, MJPEG_PORT))
    while True:
        # if not cap:
        #     break
        success, frame = cap.read()  # read the camera frame
        ret, buffer = cv2.imencode('.jpg', frame)
        # if not ret:
        #     print("Error exit code: {}".format(ret))
        #     exit(0)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
                 b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')  # concat frame one by one and show result
@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html', MQTT_BROKER_ADDRESS=MQTT_BROKER_ADDRESS,MQTT_BROKER_WEBSOCKET_PORT=MQTT_BROKER_WEBSOCKET_PORT,MQTT_BROKER_USER=MQTT_BROKER_USER,MQTT_BROKER_PASSWORD=MQTT_BROKER_PASSWORD,MQTT_TOPIC=MQTT_TOPIC,MQTT_TOPIC_CAMERA=MQTT_TOPIC_CAMERA,MQTT_TOPIC_CAMERA_MOVE=MQTT_TOPIC_CAMERA_MOVE)

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')
if __name__ == "__main__":
    app.run(debug=True)