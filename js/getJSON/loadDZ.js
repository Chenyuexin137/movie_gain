function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var socket;
var typeList
var current=0;
var total;
var beforetime;
var objData;
var IDList = ['dy01','dy02','dy03','dy04','dy05','dy06','dy07','dy08','dy09','dy10','dy11','dy12','dy13','dy14','dy15','dy16','dy17','dy18','dy19','dy20'];
var typeMovie;

function load(type_DY){
	var host = "ws://127.0.0.1:9999/";
	var str = type_DY+" I'm Websocket client!";
	// console.log(str);
	typeMovie = type_DY;
	socket = new WebSocket(host);

	try{

		socket.onopen = function(msg){
			// alert("连接成功！");
			socket.send(str);
			// alert(str);
		}

		socket.onmessage = function(msg){
			if (typeof msg.data == "string") {
				objData = JSON.parse(msg.data);
				readjson();
			}
			else{
				console.log("非文本消息");
			}
		};

		socket.onerror = function (error) { alert("Error："+ error.name); };
	}
	catch(ex){
		console.log(ex);
	}
}

window.onbeforeunload = function(){
	try{
		socket.close();
		socket = null;
	}
	catch(ex){}
};

function $(id){return document.getElementById(id);}
function onkey(event) { if (event.keyCode == 13) { send(); } }

function readjson(){
	typeList = objData.links;
	for(var i in IDList){
		typeList[i]["id"] = IDList[i]
		console.log(typeList[i]);
		var divtime = document.getElementById(IDList[i]);
		divtime.innerHTML = typeList[i]["name"];
	}
}

function readMoveData(objData,name){
	content = objData.content;
	document.getElementById('movieContent').innerHTML = content;
	img = objData.img;
	document.getElementById('movieImg').src = img;
	mvURL = objData.url;
	document.getElementById('movieURL').innerHTML = name;
	document.getElementById('movieURL').href = mvURL;
}

function readMovie(id){
	// console.log(id);
	for(var i in IDList){
		if (typeList[i]["id"]==id) {
			// console.log(typeList[i]["url"]);
			var str = "DY|"+typeList[i]["url"];
			var name = typeList[i]["name"];
			socket.send(str);
			console.log(str);
			socket.onmessage = function(msg){
				if (typeof msg.data == "string") {
					objData = JSON.parse(msg.data);
					readMoveData(objData,name);
				}
				else{
					console.log("非文本消息");
				}
			};
		}
	}
	document.getElementById('readMV').style.display='block';
}

