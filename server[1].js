/*
Server JS
Frank Giddens
May 17, 2019
*/

"use strict";

const fs = require("fs");
const os = require("os");
const url = require("url");
const http = require("http");
const io = require("socket.io");

let server;
let listener;
let port = 8080;

let events;

const getIPAddress = () => {
	let address = "127.0.0.1";
	let interfaces = os.networkInterfaces();
	for(let devName in interfaces){
		let iface = interfaces[devName];
		for(let i = 0; i < iface.length; i++){
			let alias = iface[i];
			if(alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal){
				address = alias.address;
			}
		}
	}
	return address;
};

const handleRequest = (req, res) => {
	let pathname = url.parse(req.url).pathname;
	if(pathname.indexOf(".") === -1){
		pathname += ".html";
	}
	if(pathname.indexOf("/") === 0){
		pathname = pathname.substr(1);
	}
	if(pathname === ".html"){
		pathname = "index.html";
	}
	fs.readFile(pathname, (err, data) => {
		if(err){
			res.writeHead(404, {"Content-Type" : "text/html"});
		}
		else{
			switch(pathname.substr(pathname.lastIndexOf(".") + 1)){
				case "css":
					res.writeHead(200, {"Content-Type" : "text/css"});
					res.write(data.toString());
					break;
				case "html":
					res.writeHead(200, {"Content-Type" : "text/html"});
					res.write(data.toString());
					break;
				case "js":
					res.writeHead(200, {"Content-Type" : "text/js"});
					res.write(data.toString());
					break;
				default:
					res.writeHead(200, {"Content-Type" : "text/plain"});
					res.write(data.toString());
					break;
			}
		}
		res.end();
	});
};

const initServer = () => {
  fs.readFile("events.json", (err, data) => {
		if(err){
			throw err;
		}
		events = JSON.parse(data).events;
	});
  server = http.createServer(handleRequest);
  server.listen(port, "174.86.226.55");
  listener = io.listen(server);
  listener.sockets.on("connection", (socket) => {
    socket.on("addEvent", (evt) => {
			let newEvent = evt;
			newEvent.id = events.length;
			newEvent.public = false;
			events.push(newEvent);
			fs.writeFile("events.json", JSON.stringify({"events" : events}), (err) => {
				if(err){
					throw err;
				}
			});
    });
    socket.on("getEvents", (evt) => {
			let target = [];
			if(evt.query == null){
				for(let i = 0; i < events.length; i++){
					if(events[i].public){
						target.push(events[i]);
					}
				}
			}
			else{
				for(let i = 0; i < events.length; i++){
					if((events[i].name.toUpperCase().indexOf(evt.query.toUpperCase()) !== -1 || events[i].date.toUpperCase().indexOf(evt.query.toUpperCase()) !== -1 || events[i].starttime.toUpperCase().indexOf(evt.query.toUpperCase()) !== -1 || events[i].endtime.toUpperCase().indexOf(evt.query.toUpperCase()) !== -1 || events[i].address.toUpperCase().indexOf(evt.query.toUpperCase()) !== -1 || events[i].city.toUpperCase().indexOf(evt.query.toUpperCase()) !== -1 || events[i].state.toUpperCase().indexOf(evt.query.toUpperCase()) !== -1 || events[i].description.toUpperCase().indexOf(evt.query.toUpperCase()) !== -1) && events[i].public){
						target.push(events[i]);
					}
				}
			}
			socket.emit("recEvents", {"events" : target});
    });
		socket.on("getEventsAdmin", (evt) => {
			socket.emit("recEvents", {"events" : events});
		});
    socket.on("getLogin", (evt) => {
			fs.access((evt.user + ".json"), fs.constants.F_OK | fs.constants.R_OK, (err) => {
				if(err){
					socket.emit("recLogin", {"err" : true, "user" : null, "pass" : null});
				}
				else{
					fs.readFile((evt.user + ".json"), (err, data) => {
						if(err){
							socket.emit("recLogin", {"err" : true, "user" : null, "pass" : null});
						}
						else{
							if(JSON.parse(data).pass == evt.pass){
								socket.emit("recLogin", {"err" : false, "user" : data.user, "pass" : data.pass});
							}
							else{
								socket.emit("recLogin", {"err" : true, "user" : null, "pass" : null});
							}
						}
					});
				}
			});
    });
		socket.on("switchPublic", (evt) => {
			for(let i = 0; i < events.length; i++){
				if(events[i].id == evt.id){
					events[i].public = evt.public;
				}
			}
			fs.writeFile("events.json", JSON.stringify({"events" : events}), (err) => {
				if(err){
					throw err;
				}
			});
		});
  });
  console.log("Server active at " + "174.86.226.55" + ":" + port);
}

initServer();
