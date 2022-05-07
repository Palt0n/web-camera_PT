
var mqtt;
var reconnectTimeout = 2000;
// var host='{{ MQTT_BROKER_ADDRESS }}'; //change this
// var port=parseInt('{{ MQTT_BROKER_WEBSOCKET_PORT }}');
// var username='{{ MQTT_BROKER_USER }}';
// var password='{{ MQTT_BROKER_PASSWORD }}';
var lastMsg;
var mqtt_topic;
var MQTT_TOPIC;
var MQTT_TOPIC_CAMERA;
var MQTT_TOPIC_CAMERA_MOVE;
function onFailure(message) {
    console.log("Connection Attempt to Host "+host+"Failed");
    setTimeout(MQTTconnect, reconnectTimeout);
}

function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("Connected ");
    message = new Paho.MQTT.Message("Client Connected Successfully");
    message.destinationName = MQTT_TOPIC;
    mqtt.send(message);
    console.log(MQTT_TOPIC + " " + message.payloadString)
    mqtt.subscribe(MQTT_TOPIC_CAMERA_MOVE);
    console.log(MQTT_TOPIC_CAMERA_MOVE)
    payload = {
        "camera_pan": 90,
        "camera_tilt": 90,
    }
    sendMessage(JSON.stringify(payload))
    message = new Paho.MQTT.Message(JSON.stringify(payload));
    message.destinationName = MQTT_TOPIC_CAMERA;
    mqtt.send(message)
}

function MQTTconnect(host, port, username, password, topic, topic_camera, topic_camera_move) {
    port = parseInt(port)
    console.log("connecting to "+ host +" "+ port);
    mqtt = new Paho.MQTT.Client(host, port, "clientjs");
    MQTT_TOPIC = topic
    MQTT_TOPIC_CAMERA = topic_camera
    MQTT_TOPIC_CAMERA_MOVE = topic_camera_move
    var options = {
        timeout: 3,
        userName : username,
        password : password,
        onSuccess: onConnect,
        onFailure: onFailure,
        };
    mqtt.onMessageArrived = onMessageArrived;
    mqtt.connect(options); //connect
}

// called when a message arrives
function onMessageArrived(message) {
    var subscribe_json = JSON.parse(message.payloadString)
    if ("move_camera_pan" in subscribe_json){
        P_global = subscribe_json.move_camera_pan
        A_global = convert_P_to_A(P_global)
    }
    if ("move_camera_tilt" in subscribe_json){
        T_global = subscribe_json.move_camera_tilt
        B_global = convert_T_to_B(T_global)
    }
}

function setButtonActions() {
    var buttons = document.getElementsByClassName('btn-move-camera');
    for(var i = 0; i < buttons.length; i++) {
        button = buttons[i];
        buttons[i].onclick = function(){
            sendMessage(JSON.stringify({"action": this.value}))
    }};
}

function sendMessage(value){
    console.log("MQTT SEND: ", MQTT_TOPIC_CAMERA, value);
    message = new Paho.MQTT.Message(value);
    message.destinationName = MQTT_TOPIC_CAMERA;
    mqtt.send(message)
}