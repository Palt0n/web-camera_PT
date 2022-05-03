# web-camera_PT

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
Send with 480p fails with
```
libcamera-vid -t 0 --width 858 --height 480 -q 100 -n --codec mjpeg --inline --listen -o tcp://192.168.XX.XX:XXXX
```
Probably error due
```
terminate called after throwing an instance of 'std::runtime_error'
  what():  failed to send data on socket
Aborted
```

Run `read_mjpeg_opencv.py` to view video stream

To view stream in browser, need to convert the mjpeg stream into a browser compatible format
`app.py` converts it into a constantly updating jpg image
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