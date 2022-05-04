#Import necessary libraries
from flask import Flask, render_template, Response, request
import cv2
import os
import paho.mqtt.client as mqttClient
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

client = mqttClient.Client(MQTT_CLIENT_NAME)               #create new instance
client.username_pw_set(user, password=password)    #set username and password
client.connect(broker_address, port=port)          #connect to broker
client.loop_start()        #start the loop
MQTT_TOPIC_CAMERA = MQTT_TOPIC + "/camera"

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
    return render_template('index.html', MQTT_BROKER_ADDRESS=MQTT_BROKER_ADDRESS,MQTT_BROKER_WEBSOCKET_PORT=MQTT_BROKER_WEBSOCKET_PORT,MQTT_BROKER_USER=MQTT_BROKER_USER,MQTT_BROKER_PASSWORD=MQTT_BROKER_PASSWORD,MQTT_TOPIC_CAMERA=MQTT_TOPIC_CAMERA)
@app.route('/camera', methods=['POST'])
def camera():
    print("method: {}".format(request.method))
    if request.method == 'POST':
        request_json = request.json
        print("request_json: {}".format(request_json))
        action = request_json.get('action')
        print("action: {}".format(action))
        if action == 'UP':
            client.publish(MQTT_TOPIC_CAMERA, json.dumps({"camera_tilt":180}))
        elif action == 'DOWN':
            client.publish(MQTT_TOPIC_CAMERA, json.dumps({"camera_tilt":0}))
        elif action == 'LEFT':
            client.publish(MQTT_TOPIC_CAMERA, json.dumps({"camera_pan":180}))
        elif action == 'RIGHT':
            client.publish(MQTT_TOPIC_CAMERA, json.dumps({"camera_pan":0}))
        elif action == 'MIDDLE':
            client.publish(MQTT_TOPIC_CAMERA, json.dumps({"camera_pan":90, "camera_tilt":90}))
        elif action == 'REFRESH':
            global cap
            cap = cv2.VideoCapture('http://{}:{}/frame.mjpg'.format(MJPEG_ADDRESS, MJPEG_PORT))
        else:
            pass # unknown
        print("DONE")
        return str(action)
    return "OK"

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')
if __name__ == "__main__":
    app.run(debug=True)