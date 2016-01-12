const request = require('request');
const reqUrl = "https://api.telegram.org/bot169186697:AAF4ZwiaZvhzYDssV18vlfLRU9sFRr2zOto";

const methods = {
	update: "getUpdates",
	message: "sendMessage",
	location: "sendLocation",
};

const commands = {
	register: registerAttendance,
	unregister: unregisterAttendance,
	suggest: suggestLocation,
	nolocation: removeLocation,
}

var chatIds = {};
var latestUpdate = 0;

setInterval(pollForUpdate, 10);
function pollForUpdate(){
	request.post(apiUrl("update"), {form:{offset: latestUpdate + 1}}, function(e, res, body){
		if(e){
			console.error(e);
			console.error("Offset: " + (latestUpdate + 1));
		}
		else{
			var responseBody = JSON.parse(res.body);
			if (responseBody){
				var results = responseBody.result;
				for (var i = 0; i < results.length; i++){
					if (results[i].update_id > latestUpdate){
						latestUpdate = results[i].update_id;
						var chatId = results[i].message.chat.id;
						if (!(chatId in chatIds))
							chatIds[chatId] = {};
						if (results[i].message.text){
							if (results[i].message.text[0] == "/"){
								var command = results[i].message.text.substring(1);
								if (command in commands){
									var args = {
										chatId: chatId,
										from: results[i].message.from,
									};
									commands[command](args);
								}
							}
						}
						else{
							if (results[i].message.location){
								setLocation({
									chatId: chatId,
									from: results[i].message.from,
									location: results[i].message.location,
								});
							}
						}
					}
				}
			}
		}
	});
}

function apiUrl(method){
	return reqUrl + "/" + methods[method];
}

function speak(text, chatId){
	request(apiUrl("message"), {form:{
		chat_id: chatId,
		text: text,
	}});
}

function sendLocation(location, chatId, array){
	var latitude, longitude;
	if (array){
		latitude = location[0];
		longitude = location[1];
	}
	else{
		latitude = location.latitude;
		longitude = location.longitude;
	}
	console.log(latitude, longitude);
	request(apiUrl("location"), {form:{
		chat_id: chatId,
		latitude: latitude,
		longitude: longitude,
	}});
}

function unregisterAttendance(args){
	var chatId = args.chatId;
	var	user = args.from;
	if (!chatIds[chatId].registered)
		return;
	if (user.id in chatIds[chatId].registered)
		delete chatIds[chatId].registered[user.id];
	sendAttendanceMessage(chatId);
}

function registerAttendance(args){
	var chatId = args.chatId;
	var	user = args.from;
	if (!chatIds[chatId].registered)
		chatIds[chatId].registered = {};
	if (!(user.id in chatIds[chatId].registered))
		chatIds[chatId].registered[user.id] = user.first_name;
	sendAttendanceMessage(chatId);
}

function setLocation(args){
	var chatId = args.chatId;
	var	user = args.from;
	var location = args.location;
	if (!chatIds[chatId].locations)
		chatIds[chatId].locations = {};
	chatIds[chatId].locations[user.id] = {
		location: location,
		first_name: user.first_name,
	};
	sendLocationMessage(chatId);
}

function removeLocation(args){
	var chatId = args.chatId;
	var	user = args.from;
	if (!chatIds[chatId].locations)
		return;
	if (user.id in chatIds[chatId].locations)
		delete chatIds[chatId].locations[user.id];
	sendLocationMessage(chatId);
}

const registerTemplate = "These people are meeting up!\n\n";
function sendAttendanceMessage(chatId){
	var replyMessage = registerTemplate;
	for (var i in chatIds[chatId].registered){
		replyMessage += chatIds[chatId].registered[i] + "\n";
	}
	replyMessage = replyMessage.substring(0, replyMessage.length - 1);
	speak(replyMessage, chatId);
}

const locationTemplate = "These people have registered locations\n\n";
function sendLocationMessage(chatId){
	var locationMessage = locationTemplate;
	for (var i in chatIds[chatId].locations){
		locationMessage += chatIds[chatId].locations[i].first_name + " " + chatIds[chatId].locations[i].location.latitude + "," + chatIds[chatId].locations[i].location.longitude + "\n";
	}
	locationMessage = locationMessage.substring(0, locationMessage.length - 1);
	speak(locationMessage, chatId);
}

function suggestLocation(args){
	var chatId = args.chatId;
	var locations = [];
	for (var i in chatIds[chatId].registered){
		if (i in chatIds[chatId].locations){
			locations.push([chatIds[chatId].locations[i].location.latitude, chatIds[chatId].locations[i].location.longitude].join(","));
		}
	}
	if (locations){
		console.log(locations);
		request({url:'http://10.21.112.151:3000/api/meetwhere/location', qs: locations}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var response = JSON.parse(response.body); 
				speak(response, chatId);
				var location = response.center;
				sendLocation(location, chatId, array=true);
			}
		});
	}
}