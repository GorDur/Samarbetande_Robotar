// ideer: varje bild div har 9 sub divs som antingen är non visible eller visible dessa har värdet 1 eller 0
//      struktur för robotar
    // startar från samma ställe 
    // nr1 börjar och väljer väg utifrån hirarkin höger vänster fram bak
    // vald vägoch ursprung markeras tittat samt ovalda otittat
    // nr2 startar och väljer väg enligt hirarkin


var new_Path = []
var taken_Path = []
var busy = []
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
var yes = [
[[[1,1,1],[1,0,0],[1,0,1]],[[1,1,1],[0,0,0],[1,0,1]],[[1,1,1],[0,0,0],[1,1,1]],[[1,1,1],[0,0,1],[1,0,1]]],
[[[1,0,1],[1,0,0],[1,0,1]],[[1,0,1],[0,0,0],[1,0,1]],[[1,1,1],[0,0,0],[1,1,1]],[[1,0,1],[0,0,1],[1,0,1]]],
[[[1,1,1],[1,0,0],[1,0,1]],[[1,0,1],[0,0,0],[1,1,1]],[[1,1,1],[0,0,0],[1,1,1]],[[1,0,1],[0,0,1],[1,1,1]]]]

var PictureMatrix= [Void,Straight,Curve,T,junction]
var box_size = 480;
var NewDir = []
var pic_y = 0
var pic_x = 0

class box{
    constructor(type,id,coord){
        this.directions = [];
        this.type = type;
        this.coord = coord
        this.Matrix = PictureMatrix[type]
        this.id = id;
        var container = document.getElementById(this.id[0].toString())
        let markup = `<div id="${this.id}" style ="
                    left: ${this.id[1]*box_size}px;
                    top: ${this.id[1]*-box_size}px;
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
                Matrix[this.coord[0]+x][this.coord[1]+y]= tile[x+1][y+1]
                if(tile[x+1][y+1]==0){
                    if(y+x!=0&&this.coord[0]+x<y_size*3&&this.coord[0]+x>0&&this.coord[1]+y<x_size*3&&this.coord[1]+y>0){new_Path.push(String([this.coord[0]+x,this.coord[1]+y]));console.log([this.coord[0]+x,this.coord[1]+y]+"added to new path");document.getElementById("a"+(this.coord[0]+x).toString()+","+(this.coord[1]+y).toString()).classList.add('newpath')}
                document.getElementById("a"+(this.coord[0]+x).toString()+","+(this.coord[1]+y).toString()).classList.add('on')}
            }
        }
        var rotation = 1;
        var Break = false;
        for(var q =1;q<PictureMatrix.length&& !Break;q++){
            var stencil = PictureMatrix[q];
            var New_stenc = [...stencil];
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
        img.src = "./Pictures"+Strings[this.type]
        img.style = 'transform:rotate('+ -90*rotation+'deg)'
    }
}

class robot{
    constructor(currentCoord, currentDir,Type){
        this.startPos = currentCoord;
        this.timesSearched = 0;
        field[currentCoord[0]-1][currentCoord[1]-1].Set(junction)
        this.currentBox =[(currentCoord[0]-1)/3,(currentCoord[1]-1)/3]
        this.Type = Type;
        this.currentCoord = currentCoord
        this.prevCoord = currentCoord
        this.currentDir = currentDir
        this.element = `<img id = "robot" src = ./Pictures/${Type}.png style="z-index: 2;width: ${480/3}px;height:${480/3}px;">`;
        this.stop = false
        document.getElementById("a"+currentCoord).innerHTML += this.element
        console.log("a"+currentCoord)
    }
    async follow(path){
        console.log("start follow")
        this.timesSearched += 1
        for(var x =0;x<path.length;x++){
        await sleep(50);
        console.log("following"+path[x])
        this.move(path[x])
        }
        this.currentBox = [(this.currentCoord[0]-1)/3,(this.currentCoord[1]-1)/3]
        for(var x = 0;x<document.getElementsByClassName('path').length;x++){console.log('');document.getElementsByClassName('path')[x].classList.remove('path')}
        this.discover()
    }
    async discover(){
        this.currentDir = [this.currentCoord[0]-this.prevCoord[0],this.currentCoord[1]-this.prevCoord[1]]
        while(true){
            await sleep(5);
            //first left
            if(trunDirLeft(this.currentDir,this.currentBox,3)){this.currentDir = NewDir}
            //then straight
            else if(trunDirLeft(this.currentDir,this.currentBox,0)){this.currentDir = NewDir}
            //then right
            else if(trunDirLeft(this.currentDir,this.currentBox,1)){this.currentDir = NewDir}
            //dead end
            else{break}
            this.timesSearched = 0
            this.move([this.currentCoord[0]+this.currentDir[0],this.currentCoord[1]+this.currentDir[1]])
            await RecentTile().then((answer)=>{
                field[this.currentBox[0]+this.currentDir[0]][this.currentBox[1]+this.currentDir[1]].Set(answer)
                this.currentBox = [this.currentBox[0]+this.currentDir[0],this.currentBox[1]+this.currentDir[1]]
            }).catch((e)=>{console.log(e)})
            await sleep(5);
            this.move([this.currentCoord[0]+this.currentDir[0],this.currentCoord[1]+this.currentDir[1]])
            await sleep(5);
            this.move([this.currentCoord[0]+this.currentDir[0],this.currentCoord[1]+this.currentDir[1]])
        }
        if(this.timesSearched <2){
        console.log(Matrix)
        await this.follow(ShortestPathToUnseen(this.currentCoord, Matrix));}
        else{console.log("done"+new_Path);console.log(Matrix)}
    }
    move(pos){
        this.prevCoord = this.currentCoord
        this.currentCoord = pos
        if(new_Path.includes(String(pos))){
            console.log("remove"+pos)
            remove(String(pos),new_Path)
        }
        document.getElementById("a"+this.prevCoord).innerHTML = ""
        document.getElementById("a"+this.currentCoord).innerHTML = this.element
        
    }
    Stop(){
        this.stop = true
    }
}

for(var y = 0;y<y_size*3;y++){//does not add to natrix to reduce memory use might create bug?
    var matrix_row = []
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
        matrix_row.push(1)
        var container=document.getElementById("a"+y.toString())
        let markup = `<div id="a${[y,x]}" class="arraybox"style ="
                    left: ${x*box_size/3}px;
                    top: ${x*-box_size/3}px;
                    position: relative;
                    height:${box_size/3}px;
                    width: ${box_size/3}px;
                    "></div>`
        container.innerHTML += markup
        if(pic_y==2 && pic_x ==2){
        new_row.push(new box(0,[(y-2)/3,(x-2)/3],[y-1,x-1]))
        pic_x=-1}
        pic_x++;
        
    }
    pic_x =0
    if(pic_y==2){
    field.push(new_row);
    pic_y = -1}
    Matrix.push(matrix_row)
    pic_y++
}

function Comp(New, Old){
    for(var h = 0; h<(New.length);h++){
        for(var i =0; i<New[h].length;i++){
            if(New[h][i] != Old[h][i]){return false}
        }
}return true}
async function RecentTile(){
    var types = [Straight,junction,Curve,T]
    var sel= types[Math.floor(Math.random()*4)]
    var stencil = sel;
    //console.log(sel)
    var Break = false
    var New_stenc = [...stencil];
    for(var x = 0; x<4 && !Break;x++){
        //console.log(stencil)
        if(stencil[1-rob.currentDir[0]][1-rob.currentDir[1]]==0){Break = true;/*console.log("correct")*/}
        else{New_stenc  = [];
            for(var h = 1; h<(stencil.length+1);h++){
                var array = [];
                for(var i =0; i<stencil[h-1].length;i++){
                    array.push(stencil[i][(stencil[h-1].length-h)]);
                }
            New_stenc.push(array);
        }; stencil = [...New_stenc]}; //console.log(stencil);
    }
    return stencil
}
async function setMap(map) {
    // Sleep in loop
    for(var y = 0;y<map.length;y++){
        for(var x = 0;x<map[y].length;x++){
            console.log(x,y)
            field[y][x].Set(map[y][x])
        }
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function trunDirLeft(dir,box,times){
    let angel = 0
    if(dir[0]!=0){angel=Math.asin(dir[0])}else{angel=Math.acos(dir[1])}
    for(var x= 0; x<times; x++){
        angel += Math.PI/2
    }
    NewDir = [Math.trunc(Math.sin(angel)), Math.trunc(Math.cos(angel))]
    let box2 = [box[0]+NewDir[0],box[1]+NewDir[1]]
    //is not out of bounds
    console.log(NewDir)
    if(box2[0]<y_size&&box2[0]>-1&&box2[1]<x_size&&box2[1]>-1){
        let box2coord = field[box2[0]][box2[1]].coord
        if(!new_Path.includes(String([box2coord[0]-NewDir[0],box2coord[1]-NewDir[1]]))&&Matrix[box2coord[0]][box2coord[1]]&&!Matrix[field[box[0]][box[1]].coord[0]+NewDir[0]][field[box[0]][box[1]].coord[1]+NewDir[1]]){
            console.log(new_Path.includes([box2coord[0]-NewDir[0],box2coord[1]-NewDir[1]]))
            console.log([box2coord[0]-NewDir[0],box2coord[1]-NewDir[1]]+ " has not been visited before")
            return true
        }else{
            remove(String([box2coord[0]-NewDir[0],box2coord[1]-NewDir[1]]), new_Path)
            remove(String([field[box[0]][box[1]].coord[0]+NewDir[0],field[box[0]][box[1]].coord[1]+NewDir[1]]), new_Path)
            console.log([box2coord[0]-NewDir[0],box2coord[1]-NewDir[1]]+ " has been visited before")
            //make it seen
            return false
        }
    }

    return false
}
function remove(obj,ar){
    for(var x=0;x<ar.length;x++){
        if(ar[x]=== obj){
            console.log("a"+ar[x])
            document.getElementById("a"+ar[x]).classList.remove('newpath')
            ar=ar.splice(x, 1);
        }
    }
}
function ShortestPathToUnseen(start,plane){
    var goal= []
    var test= []
    console.log(new_Path)
    for(var x=0;x<new_Path.length;x++){
        var pre =finder.findPath(start[1],start[0],parseInt(new_Path[x][2]), parseInt(new_Path[x][0]),new PF.Grid(plane))
        console.log(pre)
        if(pre.length > 0&& (pre.length-2)%3 === 0){
        test.push(pre)}
    }
    test.sort(function(a,b){return a.length-b.length})
    console.log(test)
    test[0].length = test[0].length-1
    for(var x=0;x<test[0].length;x++){
        goal.push([test[0][x][1],test[0][x][0]])
        document.getElementById('a'+test[0][x][1]+','+test[0][x][0]).classList.add('path')
    }
    return goal
}
// setMap(yes);
var yay =[[1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]
var new_Path = ['2,1','11,7','11,10','7,20','5,28','4,29','14,1','14,4','13,5']
async function hej(){
await sleep(10000)
pub("ree")}
hej()
var finder = new PF.AStarFinder();
field[0][2].Set(junction)
var rob = new robot([1,1],[0,1],"wallE")
//rob.discover()
// var path = finder.findPath(1, 5, 7, 7, grid);
// var ree = new robot([1,5],[0,0],"wallE")
// for(var x=0;x<path.length;x++){
//     document.getElementById('a'+path[x]).classList.add('path')
// }
// ree.follow(path)
