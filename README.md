# web-camera_PT
A Raspberry Pi streams MJEPG Video to a Windows PC running a Web Flask server. The server converts the MJPEG stream to `.jpg` img stream using `opencv` viewable in Chrome browser. Two RDS3115MG servos connected to the Raspberry Pi are controlled using the Adafruit 16-Channel PWM/Servo Hat. A FOTEK SSR-25DD Solid State Relay is attached directly to the GPIO pin of the Raspberry Pi to control a Water Pump. The servos and the Relay are controllable through MQTT.

On clicking the video stream, you will be able to control the Camera in Pan and Tilt directions and mouse down activates the Water Pump.

# Stuff Needed to view camera stream
1. RPI 3B+ with Bullseye arm64 lite
2. Raspberry Pi Camera v2.1
4. Windows Machine
5. RPI Power Supply
# Stuff Needed to pan tilt
5. RDS3115MG Servo Motors (Or servo motors which are strong enough)
6. Adafruit 16-Channel PWM/Servo Hat
7. 3D printed parts
8. Server Running a MQTT Broker
5. Power Supply for Servo
# Stuff Needed to make water turret
9.  12V Portable Agriculture Sprayer
10. Solid State Relay
11. 3D printed parts
12. Power Supply for 12V Motors

# Setup in RPI
## Check if libcamera works/stream setup correctly
1. Create mjpeg stream
2. View in windows machine using VLC
## Creating mjpeg stream
Run this command on RPI, add `-v` to view verbose log
The IP Address is the RPI's address, so could probably replace this with `127.0.0.1` or `localhost`, not sure, never tried

Send with 144p
```
libcamera-vid -t 0 --width 256 --height 144 -q 100 -n --codec mjpeg --inline --listen -o tcp://192.168.XX.XX:XXXX
```
Send with 240p
```
libcamera-vid -t 0 --width 352 --height 240 -q 100 -n --codec mjpeg --inline --listen -o tcp://192.168.XX.XX:XXXX
```
Send with 360p
```
libcamera-vid -t 0 --width 480 --height 360 -q 100 -n --codec mjpeg --inline --listen -o tcp://192.168.XX.XX:XXXX
```
Send with 480p (Fails! Not sure why)
```
libcamera-vid -t 0 --width 858 --height 480 -q 100 -n --codec mjpeg --inline --listen -o tcp://192.168.XX.XX:XXXX
XXX
terminate called after throwing an instance of 'std::runtime_error'
  what():  failed to send data on socket
Aborted
```
## View in Windows using VLC
At this point, the mjpeg stream should be viewable from your Windows PC.
Download vlc from https://www.videolan.org/vlc/download-windows.html
Navigate to `Media` > `Open Network Stream`
This is the stream address, the IP Address is the RPI's IP address
```
tcp/mjpeg://192.168.XX.XXXX:XXXX
```
You should see the video stream, but it will have a 2 seconds delay. We can reduce this delay by using opencv to read the stream.

## Create systemd to auto restart service
Everytime the connection is broken/reset, the libcamera service will die, so these are the steps to set up an auto reset service
```
cd /lib/systemd/system/
sudo nano libcamera_stream.service
```
```
[Unit]
Description=Runs the Libcamera Streaming Service
After=multi-user.target

[Service]
Type=simple
ExecStart=libcamera-vid -t 0 --width 256 --height 144 -q 100 -n --codec mjpeg --inline --listen -o tcp://192.168.XX.XX:XXXX
Restart=on-abort

[Install]
WantedBy=multi-user.target
```
```
sudo chmod 644 /lib/systemd/system/libcamera_stream.service
sudo systemctl daemon-reload
sudo systemctl enable libcamera_stream.service
sudo systemctl start libcamera_stream.service
sudo systemctl status libcamera_stream.service
```

# Setup in Windows
## Setup Env Variables
Create var to store the address of the rpi
Since I use `venv`, I edit my `env/Scripts/activate` with `export ENV_VAR=XXX` to create my env variable
Or you can just do `export MJPEG_ADDRESS=XXX` everytime you create a new terminal
```
MJPEG_ADDRESS=192.168.XX.XXXX
MJPEG_PORT=XXXX
```
## Install python libraries
Use pip to install `flask` and `opencv-python`
```
pip install flask
pip install opencv-python
```
If some libraries are missing, just check my `requirements.txt`

## Check if opencv works
Run simple script to view image stream from opencv
```
python read_mjpeg_opencv.py 
```
## Run Flask Server
Chrome does not support showing http mjpeg stream directly. (I think)
To view stream in browser, need to convert the mjpeg stream into a browser compatible format
The way I did it is to host a server that does the conversion from mjpeg stream into jpg.
I wrote `app.py` that converts it into a constantly updating jpg image
```
python app_basic.py
```
```
$ python app_basic.py 
 * Serving Flask app 'app_basic' (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: on
 * Running on http://127.0.0.1:5000 (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 119-083-471
127.0.0.1 - - [08/May/2022 13:48:47] "GET / HTTP/1.1" 200 -
127.0.0.1 - - [08/May/2022 13:48:47] "GET /static/style.css HTTP/1.1" 304 -
127.0.0.1 - - [08/May/2022 13:48:50] "GET /video_feed HTTP/1.1" 200 -
```
The site should be accessible on your localhost at `http://127.0.0.1:5000`
# NOTE that if you refresh the page, libcamera will die and need to be restarted.
If you have already setup the `systemd` service to auto restart it then just need to just refresh the page twice every time.
