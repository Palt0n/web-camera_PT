# web-camera_PT
A Web flask server converts the MJPEG stream from RPI to JPG img using opencv, then display in browser.
Controls added to move Camera in Pan and Tilt directions by sending MQTT commands

# Stuff Needed
1. RPI 3B+ with Bullseye arm64 lite
2. Raspberry Pi Camera v2.1
3. MQTT Server
4. Windows Machine

# Setup in RPI
## Check if libcamera works/stream setup correctly
1. Create mjpeg stream
2. View in windows machine using VLC
```
Media > Open Network Stream
tcp/mjpeg://192.168.XX.XXXX:XXXX
```
## Creating mjpeg stream
Run this command on RPI, add `-v` to view verbose log
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

# Setup in Windows
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
python app.py
```
```
python app.py 
 * Serving Flask app 'app' (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: on
 * Running on http://127.0.0.1:5000 (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 119-083-471
127.0.0.1 - - [03/May/2022 18:22:51] "GET / HTTP/1.1" 200 -
127.0.0.1 - - [03/May/2022 18:22:53] "GET /video_feed HTTP/1.1" 200 -
127.0.0.1 - - [03/May/2022 18:23:01] "GET / HTTP/1.1" 200 -
```
The site should be accessible on your localhost at `http://127.0.0.1:5000`