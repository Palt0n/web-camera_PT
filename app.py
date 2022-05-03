#Import necessary libraries
from flask import Flask, render_template, Response
import cv2
import os
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

def gen_frames():
    camera = cv2.VideoCapture('http://{}:{}/frame.mjpg'.format(MJPEG_ADDRESS, MJPEG_PORT))
    while True:
        success, frame = camera.read()  # read the camera frame
        ret, buffer = cv2.imencode('.jpg', frame)
        # if not ret:
        #     print("Error exit code: {}".format(ret))
        #     exit(0)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
                 b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')  # concat frame one by one and show result
@app.route('/')
def index():
    return render_template('index.html')
@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')
if __name__ == "__main__":
    app.run(debug=True)