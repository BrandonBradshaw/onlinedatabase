/*
Admin JS
Frank Giddens
May 17, 2019
*/

"use strict";

let socket = io.connect();

document.getElementById("logout").addEventListener("click", () => {
	window.localStorage.user = null;
	window.localStorage.pass = null;
	window.location = "index.html";
});

socket.on("recEvents", (data) => {
	let cardDump = "";
	document.getElementById("evtBody").innerHTML = "";
	for(let i = 0; i < data.events.length; i++){
		cardDump = "<div class=\"card\"><h3 class=\"card-title\">" + data.events[i].name + "</h3><hr/><h4 class=\"card-subtitle\">" + data.events[i].address + ", " + data.events[i].city + " " + data.events[i].state + "</h4><h4 class=\"card-subtitle\">" + data.events[i].date + " @ " + data.events[i].starttime + " - " + data.events[i].endtime + "</h4><h4 class=\"card-subtitle\">" + data.events[i].contact;
		if(data.events[i].public){
			cardDump += "</h4><br/><button id=\"switch" + i + "\" class=\"btn btn-primary\">Unshare</button>";
		}
		else{
			cardDump += "</h4><br/><button id=\"switch" + i + "\" class=\"btn btn-primary\">Share</button>";
		}
		cardDump += "<hr/><p class=\"card-body\">" + data.events[i].description + "</p></div>";
		document.getElementById("evtBody").innerHTML += cardDump;
		document.getElementById("switch" + i).addEventListener("click", () => {
			if(!data.events[i].public){
				document.getElementById("switch" + i).textContent = "Unshare";
				socket.emit("switchPublic", {"id" : data.events[i].id, "public" : true});
				socket.emit("getEventsAdmin", {});
			}
			else{
				document.getElementById("switch" + i).textContent = "Share";
				socket.emit("switchPublic", {"id" : data.events[i].id, "public" : false});
				socket.emit("getEventsAdmin", {});
			}
		});
	}
});

socket.on("recLogin", (data) => {
	if(data.err == "true"){
		window.localStorage.user = null;
		window.localStorage.pass = null;
		window.location = "index.html";
	}
	else{
		socket.emit("getEventsAdmin", {});
	}
});

if((window.localStorage.user == undefined || window.localStorage.user == null || window.localStorage.user == "null") || (window.localStorage.pass == undefined || window.localStorage.pass == null || window.localStorage.pass == "null")){
	window.location = "index.html";
}
else{
	socket.emit("getLogin", {"user" : window.localStorage.user, "pass" : window.localStorage.pass});
}
