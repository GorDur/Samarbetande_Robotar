ConnectBtn = document.getElementById("connect")
log = document.getElementById("message")
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
    client.send(message);//skickar ett sista medelande
    client.disconnect();
    console.log("disconnected")
}
function pub(dataobjekt){//skickar medelande
    message = new Paho.MQTT.Message(JSON.stringify(dataobjekt));
    message.destinationName = "oliver.witzelhelmin@abbindustrigymnasium.se/vroom_vroomO";// ger medelandet en destination
    if (ConnectBtn.innerHTML =="Disconnect"){// om websidan är kopplad med mqtt skckas medelandet
    console.log(message)
    client.send(message);//skickar iväg medelandet till ena roboten
    // robotarna delades upp till två topics då det inte fungerade att ha dem på samma
    }else{
        log.value = "Can't publish while disconnected \n"
    }}
function onFail() {// när det inte går att koppla upp så skrivs error medelande upp
    ConnectBtn.innerHTML= "Connect";
    console.log('<span>ERROR: Connection to: ' + host + ' on port: ' + port + ' failed.</span><br/>');// indikerar om man inte kan connecta
    log.value = "Error could not establish a connection to the broker"
}

function onConnectionLost(responseObject){// när upkopplingen bryts så skrivs fel medelande
    ConnectBtn.innerHTML= "Connect";
    console.log('<span>ERROR: ' + host + ' on port: ' + port + ' has been shut down.</span><br/>');
    log.value = "unnexpected broker failure"
    if (responseObject.errorCode !== 0) {
        console.error('<span>ERROR: ' + + responseObject.errorMessage + '</span><br/>');
    }}  

function onConnect() {//subar till roboternas topics och skickar ett hello world
    topic = 'oliver.witzelhelmin@abbindustrigymnasium.se/broom_broomS';
    console.log('<span>Subscribing to: ' + topic + '</span><br/>');
    client.subscribe(topic);
    client.subscribe("oliver.witzelhelmin@abbindustrigymnasium.se/broom_broomO")// Olivers robot
    message = new Paho.MQTT.Message("Hello World 2");
    message.destinationName = "oliver.witzelhelmin@abbindustrigymnasium.se/broom_broomS";// Simons robot
    client.send(message);
    log.value = "Succsesfully conected to broker \n"
}
function onMessageArrived(message) {// hanterar inkommande medelande
    var context = message.payloadString;
    console.log(message.destinationName)
    if(message.destinationName == "oliver.witzelhelmin@abbindustrigymnasium.se/broom_broomO"){// kollar vems robot det är
        if(context[0]=="{"){// kollar att det är en JSON fil             
            var json = JSON.parse(context);//parse:ar filen
            console.log(json);
            line = "RPM:    "+json["O"][0]+" Proportionell:    "+json["O"][1]+" Integration:    "+json["O"][2]+" Derivering:    "+json["O"][3]+" Time:    "+json["O"][4];
            // filen är komprimerad för att spara utryme således blir den svår läst
            oliver.value += line+"\n";// skriver de nya värderna
            if(time_oliver ==0){time_oliver = json["O"][4]}// skapar en start tid
            charts[0].data.labels.push(json["O"][4]-time_oliver);// sätter in robotens nya värden i grafen
            charts[0].data.datasets[0].data.push(json["O"][0])// rpm värdet
            charts[0].data.datasets[1].data.push(Values[5].value)// bör
            charts[0].update()
            return
        }else{log.innerHTML+=context+"\n"}//om det inte är en JSON fil så är det bara ett vanligt medelande
    }
    if(message.destinationName = "oliver.witzelhelmin@abbindustrigymnasium.se/broom_broomS"){// samma som ovan fast för simons robot
        if(context[0]=="{"){            
            var json = JSON.parse(context);
            console.log(json);
            line = "RPM:    "+json["S"][0]+" Proportionell:    "+json["S"][1]+" Integration:    "+json["S"][2]+" Derivering:    "+json["S"][3]+" Time:    "+json["S"][4];
            simon.value += line+"\n";  
            if(time ==0){time = json["S"][4]}
            charts[1].data.datasets[0].data.push(json["S"][0])
            charts[1].data.datasets[1].data.push(Values[5].value)
            charts[1].data.labels.push(json["S"][4]-time);
            charts[1].update()
        }else{simon.value+=context+"\n"}}
    console.log("message arrived:"+context)// skriver ut medelandet för enklare felsökning
    }