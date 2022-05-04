import paho.mqtt.client as mqttClient
import time
import os

MQTT_BROKER_ADDRESS = os.environ.get("MQTT_BROKER_ADDRESS")
MQTT_BROKER_PORT = os.environ.get("MQTT_BROKER_PORT")
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

def on_connect(client, userdata, flags, rc):
  
    if rc == 0:
  
        print("Connected to broker")
  
        global Connected                #Use global variable
        Connected = True                #Signal connection 
  
    else:
  
        print("Connection failed")
  
def on_message(client, userdata, message):
    print("Message received: "  + str(message.payload))
  
Connected = False   #global variable for the state of the connection
  
broker_address = MQTT_BROKER_ADDRESS
port = MQTT_BROKER_PORT
user = MQTT_BROKER_USER
password = MQTT_BROKER_PASSWORD

client = mqttClient.Client(MQTT_CLIENT_NAME)               #create new instance
client.username_pw_set(user, password=password)    #set username and password
client.on_connect = on_connect                      #attach function to callback
client.on_message = on_message                      #attach function to callback

client.connect(broker_address, port=port)          #connect to broker
  
client.loop_start()        #start the loop
  
while Connected != True:    #Wait for connection
    time.sleep(0.1)
  
client.subscribe(MQTT_TOPIC+"/#")
# client.publish(topic, msg)

try:
    while True:
        time.sleep(1)
  
except KeyboardInterrupt:
    print("exiting")
    client.disconnect()
    client.loop_stop()