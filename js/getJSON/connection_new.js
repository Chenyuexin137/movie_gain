function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var socket;
var current=0;
var total;
var beforetime;

function loadMovieData(type_DY){
	var host = "ws://127.0.0.1:9999/";
	var str = type_DY+" I'm Websocket client!";
	socket = new WebSocket(host);

	try{

		socket.onopen = function(msg){
			// alert("连接成功！");
			socket.send(str);
			// alert(str);
		}

		socket.onmessage = function(msg){
			if (typeof msg.data == "string") {
				var obj = JSON.parse(msg.data);
				readjson(obj);
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

function readjson(data){
	var typeList = data.links;
	for(var i in typeList){
		console.log(typeList[i]);
	}
}