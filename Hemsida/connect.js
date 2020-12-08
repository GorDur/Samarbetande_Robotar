ConnectBtn = document.getElementById("connect")
log1 = document.getElementById("wallE")
log2 = document.getElementById("EVE")
function startConnect() {//kopplar upp websidan till mqtt
    clientID = "clientID_" + parseInt(Math.random() * 100);//variabler för att logga in
    host = 'maqiatto.com';
    port = 8883;
    console.log("weeeeeee")
    client = new Paho.MQTT.Client(host, Number(port), clientID);
    client.onConnectionlost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({userName : "oliver.witzelhelmin@abbindustrigymnasium.se",password : "vroom",
        onSuccess: onConnect,//referarar till olika funktioner beroende på de olika fallen som kan uppstå
        onFailure: onFail,
    });
}
function startDisconnect(){//kopplar ned från mqtt
    message = new Paho.MQTT.Message(JSON.stringify(clientID));
    message.destinationName = "offline";
    //client.send(message);//skickar ett sista medelande
    client.disconnect();
    console.log("disconnected")
}
function publish(dataobjekt,dest){//skickar medelande
    if(dataobjekt[0]="{"){
        dataobjekt = JSON.stringify(dataobjekt)
    }
    message = new Paho.MQTT.Message(dataobjekt);
    message.destinationName = "oliver.witzelhelmin@abbindustrigymnasium.se/ToRobot"+dest;// ger medelandet en destination
    if (ConnectBtn.innerHTML =="Disconnect"){// om websidan är kopplad med mqtt skckas medelandet
    console.log(message)
    client.send(message);//skickar iväg medelandet till ena roboten
    }else{
        log1.value = "Can't publish while disconnected \n"
        log2.value = "Can't publish while disconnected \n"
    }}
function onFail() {// när det inte går att koppla upp så skrivs error medelande upp
    ConnectBtn.innerHTML= "Connect";
    console.log('<span>ERROR: Connection to: ' + host + ' on port: ' + port + ' failed.</span><br/>');// indikerar om man inte kan connecta
    log1.value = "Error could not establish a connection to the broker"
    log2.value = "Error could not establish a connection to the broker"
}

function onConnectionLost(responseObject){// när upkopplingen bryts så skrivs fel medelande
    ConnectBtn.innerHTML= "Connect";
    console.log('<span>ERROR: ' + host + ' on port: ' + port + ' has been shut down.</span><br/>');
    log1.value = "unnexpected broker failure"
    log2.value = "unnexpected broker failure"
    if (responseObject.errorCode !== 0) {
        console.error('<span>ERROR: ' + + responseObject.errorMessage + '</span><br/>');
    }}  

function onConnect() {//subar till roboternas topics och skickar ett hello world
    topic = 'oliver.witzelhelmin@abbindustrigymnasium.se/FromRobot';
    console.log('<span>Subscribing to: ' + topic + '1</span><br/>');
    client.subscribe(topic+"1");
    client.subscribe(topic+"2");
    message = new Paho.MQTT.Message("Hello World 2");
    message.destinationName = "oliver.witzelhelmin@abbindustrigymnasium.se/ToRobotEVE";// Simons robot
    client.send(message);
    log1.value = "Succsesfully conected to broker \n"
    log2.value = "Succsesfully conected to broker \n"
}
function onMessageArrived(message) {// hanterar inkommande medelande
    var context = message.payloadString;
    console.log(message.destinationName)
    if(message.destinationName == "oliver.witzelhelmin@abbindustrigymnasium.se/FromRobot1"){// kollar vems robot det är
        if(context[0]=="{"){
            console.log(context)          
            var json = JSON.parse(context);
            console.log(json.tile);
            var square = [[1,1,1],[1,1,1],[1,1,1]]
            var dir = wallE.currentDir
            if(json.tile[0]+json.tile[1]+json.tile[2]+json.tile[3]!=0){
                square[1][1]=0
                if(json.tile[0]==1){square[1-dir[1]][1-dir[0]]=0}
                if(json.tile[1]==1){square[1+dir[1]][1+dir[0]]=0}
                if(json.tile[2]==1){square[1+dir[0]][1+dir[1]]=0}
                if(json.tile[3]==1){square[1-dir[0]][1-dir[1]]=0}
                console.log(square)
                wallE.discover(square)}
        }else{log1.innerHTML+=context+"\n"}//om det inte är en JSON fil så är det bara ett vanligt medelande
    }
    if(message.destinationName == "oliver.witzelhelmin@abbindustrigymnasium.se/FromRobot2"){// samma som ovan fast för simons robot
        if(context[0]=="{"){ 
            console.log("bröh")          
            var json = JSON.parse(context);
            console.log(json.tile);
            var square = [[1,1,1],[1,1,1],[1,1,1]]
            var dir = EVE.currentDir
            if(json.tile[0]+json.tile[1]+json.tile[2]+json.tile[3]!=0){
                square[1][1]=0
                if(json.tile[0]==1){square[1-dir[1]][1-dir[0]]=0}
                if(json.tile[1]==1){square[1+dir[1]][1+dir[0]]=0}
                if(json.tile[2]==1){square[1+dir[0]][1+dir[1]]=0}
                if(json.tile[3]==1){square[1-dir[0]][1-dir[1]]=0}
                console.log(square)
                EVE.discover(square)}
        }else{log2+=context+"\n"}}
    console.log("message arrived:"+context)// skriver ut medelandet för enklare felsökning
    }