// ideer: varje bild div har 9 sub divs som antingen är non visible eller visible dessa har värdet 1 eller 0
window.addEventListener('load', f => {
    document.getElementById("hej").addEventListener('click', function(){
        document.getElementById('Map').classList.toggle('ree')
    })},false);

class box{
    constructor(type,id,coord){
        this.type = type;
        this.coord = coord
        this.Matrix = PictureMatrix[type]
        this.id = id;
        var container = document.getElementById(this.id[1].toString())
        let markup = `<div id="${this.id}" style ="
                    left: ${this.id[0]*box_size}px;
                    top: ${this.id[0]*-box_size}px;
                    background-color: #FFF;
                    position: relative;
                    height:${box_size}px;
                    width: ${box_size}px;
                    "><img id = "img ${this.id}" src = ./Pictures${Strings[type]}>${this.coord}</div>`
        container.innerHTML += markup
    }
    Set(tile){
        for(y=-1;y<2;y++){
            for(x=-1;x<2;x++){
                Matrix[this.coord[1]+y][this.coord[0]+x]= tile[y+1][x+1]
                if(tile[y+1][x+1]==0){
                    //console.log("a"+(this.coord[1]+y).toString()+","+(this.coord[0]+x).toString())
                document.getElementById("a"+(this.coord[0]+x).toString()+","+(this.coord[1]+y).toString()).classList.add('on')}
            }
        }
        var rotation = 1;
        var Break = false;
        //console.log(tile)
        for(var q =1;q<PictureMatrix.length&& !Break;q++){
            //console.log(q)
            var stencil = PictureMatrix[q];
            var New_stenc = [...stencil];
            //console.log(New_stenc)
            for(var x = 0; x<4 && !Break;x++){
                if(Comp(New_stenc,tile)){this.type =q;rotation=x;this.Matrix = tile;Break =true;console.log("Match found at", this.id)}
                else{New_stenc  = [];
                    for(var h = 1; h<(stencil.length+1);h++){
                        var array = [];
                        for(var i =0; i<stencil[h-1].length;i++){
                            array.push(stencil[i][(stencil[h-1].length-h)]);
                        }
                        New_stenc.push(array);
                    }; stencil = [...New_stenc]}
        }}
        console.log(rotation)
        var img = document.getElementById("img "+this.id.toString())
        img.src = Strings[this.type]
        img.style = 'transform:rotate('+ -90*rotation+'deg)'
    }
}

var y_size = 10
var x_size = 10
var field = []
var Matrix = []
var Strings =["/void.jpg","/Straight.jpg","/Curve.jpg","/T-junction.jpg","/4 junction.jpg"]
var Void = [ [1,1,1],
            [1,1,1],
            [1,1,1]];
var Straight = [[1,1,1],
                [0,0,0],
                [1,1,1]];
var Curve = [[1,1,1],
            [1,0,0],
            [1,0,1]];
var junction = [[1,0,1],
                [0,0,0],
                [1,0,1]];
var T = [[1,0,1],
         [1,0,0],
         [1,0,1]];
var PictureMatrix= [Void,Straight,Curve,T,junction]
var box_size = 480;
document.getElementById("Map").style.height= window.innerHeight+'px'

document.getElementById("array").style.height= window.innerHeight+'px'
var pic_y = 0
var pic_x = 0
for(var y = 0;y<y_size*3;y++){
    var Matrix_row = []
    var container=document.getElementById("array")
        let markup = `<ul id="a${y}" style ="
                    position: relative;
                    z-index: 0;
                    width: ${box_size*x_size}px;
                    height:${box_size/3}px;
                    "></ul>`
        container.innerHTML += markup
    if(pic_y == 2){   
    var new_row = []
    var container=document.getElementById("Map")
        let markup = `<ul id="${(y-2)/3}" style ="
                    position: relative;
                    z-index: 0;
                    background-color: #FFF;
                    left: 0px;
                    width: ${box_size*x_size}px;
                    height:${box_size}px;
                    "></ul>`
        container.innerHTML += markup}
    for(var x = 0;x<x_size*3;x++){
        Matrix_row.push[1]
        var container=document.getElementById("a"+y.toString())
        let markup = `<div id="a${[x,y]}" class="arraybox"style ="
                    left: ${x*box_size/3}px;
                    top: ${x*-box_size/3}px;
                    position: relative;
                    height:${box_size/3}px;
                    width: ${box_size/3}px;
                    "></div>`
        container.innerHTML += markup
        if(pic_y==2 && pic_x ==2){
        new_row.push(new box(0,[(x-2)/3,(y-2)/3],[x-1,y-1]))
        pic_x=-1}
        pic_x++;
        
    }
    pic_x =0
    if(pic_y==2){
    field.push(new_row);
    pic_y = -1}
    Matrix.push(Matrix_row)
    pic_y++
}


function Comp(New, Old){
    for(var h = 0; h<(New.length);h++){
        for(var i =0; i<New[h].length;i++){
            if(New[h][i] != Old[h][i]){return false}
        }
}return true}
// field[0][0].Set(Curve)
// field[1][0].Set([[1,0,1],[1,0,0],[1,0,1]])
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
var yes = [
            [[[1,1,1],[1,0,0],[1,0,1]],[[1,1,1],[0,0,0],[1,0,1]],[[1,1,1],[0,0,0],[1,1,1]],[[1,1,1],[0,0,1],[1,0,1]]],
            [[[1,0,1],[1,0,0],[1,0,1]],[[1,0,1],[0,0,0],[1,0,1]],[[1,1,1],[0,0,0],[1,1,1]],[[1,0,1],[0,0,1],[1,0,1]]],
            [[[1,1,1],[1,0,0],[1,0,1]],[[1,0,1],[0,0,0],[1,1,1]],[[1,1,1],[0,0,0],[1,1,1]],[[1,0,1],[0,0,1],[1,1,1]]]]

async function setMap() {
    // Sleep in loop
    for(var y = 0;y<3;y++){
        for(var x = 0;x<4;x++){
            console.log(x,y)
            field[y][x].Set(yes[y][x])
        }
    }
  }
  
  setMap();



function startConnect() {//kopplar upp websidan till mqtt
    clientID = "clientID_" + parseInt(Math.random() * 100);//variabler för att logga in
    host = 'maqiatto.com';
    port = 8883;
    client = new Paho.MQTT.Client(host, Number(port), clientID);
    client.onConnectionlost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({userName : "oliver.witzelhelmin@abbindustrigymnasium.se",password : "vroom",
        onSuccess: onConnect,//referarar till olika funktioner beroende på de olika fallen som kan uppstå
        onFailure: onFail,
    });
}
function startDisconnect(){//kopplar ned från mqtt
    ConnectBtn.innerHTML= "Connect Client";
    Status.innerHTML = "Disconnected";
    message = new Paho.MQTT.Message(JSON.stringify(clientID));
    message.destinationName = "offline";
    client.send(message);//skickar ett sista medelande
    client.disconnect();
    console.log("disconnected")
}
function pub(dataobjekt){//skickar medelande
    message = new Paho.MQTT.Message(JSON.stringify(dataobjekt));
    message.destinationName = "oliver.witzelhelmin@abbindustrigymnasium.se/vroom_vroomO";// ger medelandet en destination
    if (Status.innerHTML =="Connected"){// om websidan är kopplad med mqtt skckas medelandet
    console.log(message)
    client.send(message);//skickar iväg medelandet till ena roboten
    message = new Paho.MQTT.Message(JSON.stringify(dataobjekt));
    message.destinationName = "oliver.witzelhelmin@abbindustrigymnasium.se/vroom_vroomS";
    client.send(message)// skickar iväg till den andra
    // robotarna delades upp till två topics då det inte fungerade att ha dem på samma
    }else{
        log.value = "Can't publish while disconnected \n"
    }}
function onFail() {// när det inte går att koppla upp så skrivs error medelande upp
    ConnectBtn.innerHTML= "Connect Client";
    Status.innerHTML = "Disconnected";
    console.log('<span>ERROR: Connection to: ' + host + ' on port: ' + port + ' failed.</span><br/>');// indikerar om man inte kan connecta
    log.value = "Eroor could not establish a connection to the broker"}

function onConnectionLost(responseObject){// när upkopplingen bryts så skrivs fel medelande
    ConnectBtn.innerHTML= "Connect Client";
    Status.innerHTML = "Disconnected";
    console.log('<span>ERROR: ' + host + ' on port: ' + port + ' has been shut down.</span><br/>');
    log.value = "unnexpected broker failure"
    if (responseObject.errorCode !== 0) {
        Status.innerHTML += '<span>ERROR: ' + + responseObject.errorMessage + '</span><br/>';
    }}  

function onConnect() {//subar till roboternas topics och skickar ett hello world
    ConnectBtn.innerHTML= "Disconnect Client";
    Status.innerHTML="Connected";
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
        }else{oliver.value+=context+"\n"}//om det inte är en JSON fil så är det bara ett vanligt medelande
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
    
    var astar = {
        init: function(grid) {
            for(var x = 0, xl = grid.length; x < xl; x++) {
                for(var y = 0, yl = grid[x].length; y < yl; y++) {
                    var node = grid[x][y];
                    node.f = 1;// change when a working sim is possible
                    node.g = 1;
                    node.h = 1;
                    node.cost = 1;
                    node.visited = false;
                    node.closed = false;
                    node.parent = null;
                }
            }
        },
        heap: function() {
            return new BinaryHeap(function(node) {
                return node.f;
            });
        },
        search: function(grid, start, end, diagonal, heuristic) {
            astar.init(grid);
            heuristic = heuristic || astar.manhattan;
            diagonal = !!diagonal;
    
            var openHeap = astar.heap();
    
            openHeap.push(start);
    
            while(openHeap.size() > 0) {
    
                // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
                var currentNode = openHeap.pop();
    
                // End case -- result has been found, return the traced path.
                if(currentNode === end) {
                    var curr = currentNode;
                    var ret = [];
                    while(curr.parent) {
                        ret.push(curr);
                        curr = curr.parent;
                    }
                    return ret.reverse();
                }
    
                // Normal case -- move currentNode from open to closed, process each of its neighbors.
                currentNode.closed = true;
    
                // Find all neighbors for the current node. Optionally find diagonal neighbors as well (false by default).
                var neighbors = astar.neighbors(grid, currentNode, diagonal);
    
                for(var i= 0, il = neighbors.length; i < il; i++) {
                    var neighbor = neighbors[i];
    
                    if(neighbor.closed || neighbor.isWall()) {
                        // Not a valid node to process, skip to next neighbor.
                        continue;
                    }
    
                    // The g score is the shortest distance from start to current node.
                    // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                    var gScore = currentNode.g + neighbor.cost;
                    var beenVisited = neighbor.visited;
    
                    if(!beenVisited || gScore < neighbor.g) {
    
                        // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                        neighbor.visited = true;
                        neighbor.parent = currentNode;
                        neighbor.h = neighbor.h || heuristic(neighbor.pos, end.pos);
                        neighbor.g = gScore;
                        neighbor.f = neighbor.g + neighbor.h;
    
                        if (!beenVisited) {
                            // Pushing to heap will put it in proper place based on the 'f' value.
                            openHeap.push(neighbor);
                        }
                        else {
                            // Already seen the node, but since it has been rescored we need to reorder it in the heap
                            openHeap.rescoreElement(neighbor);
                        }
                    }
                }
            }
    
            // No result was found - empty array signifies failure to find path.
            return [];
        },
        manhattan: function(pos0, pos1) {
            // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
    
            var d1 = Math.abs (pos1.x - pos0.x);
            var d2 = Math.abs (pos1.y - pos0.y);
            return d1 + d2;
        },
        neighbors: function(grid, node, diagonals) {
            var ret = [];
            var x = node.x;
            var y = node.y;
    
            // West
            if(grid[x-1] && grid[x-1][y]) {
                ret.push(grid[x-1][y]);
            }
    
            // East
            if(grid[x+1] && grid[x+1][y]) {
                ret.push(grid[x+1][y]);
            }
    
            // South
            if(grid[x] && grid[x][y-1]) {
                ret.push(grid[x][y-1]);
            }
    
            // North
            if(grid[x] && grid[x][y+1]) {
                ret.push(grid[x][y+1]);
            }
    
            if (diagonals) {
    
                // Southwest
                if(grid[x-1] && grid[x-1][y-1]) {
                    ret.push(grid[x-1][y-1]);
                }
    
                // Southeast
                if(grid[x+1] && grid[x+1][y-1]) {
                    ret.push(grid[x+1][y-1]);
                }
    
                // Northwest
                if(grid[x-1] && grid[x-1][y+1]) {
                    ret.push(grid[x-1][y+1]);
                }
    
                // Northeast
                if(grid[x+1] && grid[x+1][y+1]) {
                    ret.push(grid[x+1][y+1]);
                }
    
            }
    
            return ret;
        }
    };

    astar.init(Matrix)
    astar.search(Matrix,[1,5],[1,8],false)
    