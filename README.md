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