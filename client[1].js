/*
Client JS
Frank Giddens
May 17, 2019
*/

"use strict";

let socket = io.connect();

document.getElementById("btnEvent").addEventListener("click", () => {
  if(document.getElementById("tbxEventName").value.length > 0){
    if(document.getElementById("tbxDate").value.length > 0){
      if(document.getElementById("tbxStartTime").value.length > 0){
        if(document.getElementById("tbxEndTime").value.length > 0){
          if(document.getElementById("tbxAddress").value.length > 0){
            if(document.getElementById("tbxCity").value.length > 0){
              if(document.getElementById("tbxState").value.length > 0){
                if(document.getElementById("tbxDescription").value.length > 0){
									if(document.getElementById("tbxContact").value.length > 0){
										socket.emit("addEvent", {"name" : document.getElementById("tbxEventName").value, "date" : document.getElementById("tbxDate").value, "starttime" : document.getElementById("tbxStartTime").value, "endtime" : document.getElementById("tbxEndTime").value, "address" : document.getElementById("tbxAddress").value, "city" : document.getElementById("tbxCity").value, "state" : document.getElementById("tbxState").value, "description" : document.getElementById("tbxDescription").value, "contact" : document.getElementById("tbxContact").value});
										document.getElementById("status").textContent = "";
									}
									else{
										document.getElementById("addStatus").textContent = "No email address found, please try again";
									}
                }
                else{
									document.getElementById("addStatus").textContent = "No event description found, please try again";
                }
              }
              else{
								document.getElementById("addStatus").textContent = "No state found, please try again";
              }
            }
            else{
							document.getElementById("addStatus").textContent = "No city found, please try again";
            }
          }
          else{
						document.getElementById("addStatus").textContent = "No address found, please try again";
          }
        }
        else{
					document.getElementById("addStatus").textContent = "No end time found, please try again";
        }
      }
      else{
				document.getElementById("addStatus").textContent = "No start time found, please try again";
      }
    }
    else{
			document.getElementById("addStatus").textContent = "No event date found, please try again";
    }
  }
  else{
		document.getElementById("addStatus").textContent = "No event name found, please try again";
  }
});

document.getElementById("btnLogin").addEventListener("click", () => {
  socket.emit("getLogin", {"user" : document.getElementById("tbxUsername").value, "pass" : document.getElementById("tbxPassword").value});
});

document.getElementById("btnSearch").addEventListener("click", () => {
  socket.emit("getEvents", {"query" : document.getElementById("tbxSearch").value});
});

socket.on("recEvents", (evt) => {
	document.getElementById("evtBody").innerHTML = "";
	for(let i = 0; i < evt.events.length; i++){
		document.getElementById("evtBody").innerHTML += ("<div class=\"card\"><h3 class=\"card-title\">" + evt.events[i].name + "</h3><hr/><h4 class=\"card-subtitle\">" + evt.events[i].address + ", " + evt.events[i].city + " " + evt.events[i].state + "</h4><br/><h4 class=\"card-subtitle\">" + evt.events[i].date + " @ " + evt.events[i].starttime + " - " + evt.events[i].endtime + "</h4><hr/><p class=\"card-body\">" + evt.events[i].description + "</p></div><br/>");
	}
});

socket.on("regEvent", (evt) => {
  if(evt.err){
		document.getElementById("addStatus").textContent = "Unknown error registering event, please try again";
  }
  else{
    document.getElementById("tbxEventName").value = "";
    document.getElementById("tbxDate").value = "";
    document.getElementById("tbxStartTime").value = "";
    document.getElementById("tbxEndTime").value = "";
    document.getElementById("tbxAddress").value = "";
    document.getElementById("tbxCity").value = "";
    document.getElementById("tbxState").value = "";
    document.getElementById("tbxDescription").value = "";
		document.getElementById("tbxContact").value = "";
  }
});

socket.on("recLogin", (evt) => {
	window.localStorage.user = evt.user;
	window.localStorage.pass = evt.pass;
	if(evt.err == "true"){
		document.getElementById("loginStatus").textStatus = "Incorrect username or password, please try again";
	}
	else{
		window.location = "admin.html";
	}
});

socket.emit("getEvents", {"query" : null});
