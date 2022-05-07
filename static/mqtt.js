
var mqtt;
var reconnectTimeout = 2000;
// var host='{{ MQTT_BROKER_ADDRESS }}'; //change this
// var port=parseInt('{{ MQTT_BROKER_WEBSOCKET_PORT }}');
// var username='{{ MQTT_BROKER_USER }}';
// var password='{{ MQTT_BROKER_PASSWORD }}';
var lastMsg;
var mqtt_topic;
function onFailure(message) {
    console.log("Connection Attempt to Host "+host+"Failed");
    setTimeout(MQTTconnect, reconnectTimeout);
}
function onMessageArrived(msg){
    out_msg="Message received "+msg.payloadString+"<br>";
    out_msg=out_msg+"Message received Topic "+msg.destinationName;
    console.log(out_msg);
}

function onConnect() {
// Once a connection has been made, make a subscription and send a message.

    console.log("Connected ");
    // mqtt.subscribe('{{ MQTT_TOPIC_CAMERA }}');
    // message = new Paho.MQTT.Message("Client Connected Sucessfully");
    // message.destinationName = '{{ MQTT_TOPIC_CAMERA }}';
    // mqtt.send(message);
}

function MQTTconnect(host, port, username, password, topic) {
    port = parseInt(port)
    console.log("connecting to "+ host +" "+ port);
    mqtt = new Paho.MQTT.Client(host, port, "clientjs");
    mqtt_topic = topic
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

function setButtonActions() {
    var buttons = document.getElementsByClassName('btn-move-camera');
    for(var i = 0; i < buttons.length; i++) {
        console.log(i);
        button = buttons[i];
        buttons[i].onclick = function(){
            sendMessage(JSON.stringify({"action": this.value}))
    }};
}

function sendMessage(value){
    message = new Paho.MQTT.Message(value);
    message.destinationName = mqtt_topic;
    mqtt.send(message)
    console.log("MQTT SENT: ", value);
}