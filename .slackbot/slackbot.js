var Slack = require('slack-client');

var wit = require('node-wit');

var request = require('request');
 
var token = 'xoxb-18254648672-5FyCMU2xBDO7J8e8pCfb7EUJ';

var WIT_ACCESS_TOKEN = "EJW7CKJ5R75UW3CMBUQ7PQVD7UGTZYLJ";
 
var slack = new Slack(token, true, true);

state = 0;

var makeMention = function(userId) {
    return '<@' + userId + '>';
};
 
var isDirect = function(userId, messageText) {
    var userTag = makeMention(userId);
    return messageText &&
           messageText.length >= userTag.length &&
           messageText.substr(0, userTag.length) === userTag;
};
 
var getOnlineHumansForChannel = function(channel) {
    if (!channel) return [];
 
    return (channel.members || [])
        .map(function(id) { return slack.users[id]; })
        .filter(function(u) { return !!u && !u.is_bot && u.presence === 'active'; });
};

var NLP = function(message) {
    wit.captureTextIntent(WIT_ACCESS_TOKEN, message, function (err, res) {
        console.log("Response from Wit for text input: ");
        if (err) console.log("Error: ", err);
        return res;
    });
}

var getResults = function(locations) {
    request({url:'http://10.12.20.38:3000/hello',qs:locations}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(response.body); // Show the HTML for the Google homepage. 
      }
    });
}

 
slack.on('open', function () {
    var channels = Object.keys(slack.channels)
        .map(function (k) { return slack.channels[k]; })
        .filter(function (c) { return c.is_member; })
        .map(function (c) { return c.name; });
 
    var groups = Object.keys(slack.groups)
        .map(function (k) { return slack.groups[k]; })
        .filter(function (g) { return g.is_open && !g.is_archived; })
        .map(function (g) { return g.name; });
 
    console.log('Welcome to Slack. You are ' + slack.self.name + ' of ' + slack.team.name);
 
    if (channels.length > 0) {
        console.log('You are in: ' + channels.join(', '));
    }
    else {
        console.log('You are not in any channels.');
    }
 
    if (groups.length > 0) {
       console.log('As well as: ' + groups.join(', '));
    }
});
 
slack.on('message', function(message) {
    var channel = slack.getChannelGroupOrDMByID(message.channel);
    var user = slack.getUserByID(message.user);
 
    if (message.type === 'message' && isDirect(slack.self.id, message.text)) {

        var trimmedMessage = message.text.substr(makeMention(slack.self.id).length).trim();

        console.log(state);
        if (state === 1) {
            if (trimmedMessage === "done") {
                channel.send('Ok! Finding nice places now, please gimme a sec!')
                var results = getResults(locations);
                locations = [];
                channel.send('results');
                state = 0;
            }
            else {
                locations.push(trimmedMessage)
                channel.send('Got it. Adding ' + trimmedMessage +' to list.')
                console.log(locations);
            }     
        }

        if (state === 0) {
            if (trimmedMessage.indexOf('hey meetbot') >= 0) {
                //var reply = NLP(trimmedMessage);
                //console.log(reply.outcomes);
                channel.send("Hello! Who's meeting up today?");
                locations = [];
                state = 1;
            }
        }


        var onlineUsers = getOnlineHumansForChannel(channel)
            .filter(function(u) { return u.id != user.id; })
            .map(function(u) { return makeMention(u.id); });
        //channel.send(onlineUsers.join(', ') + '\r\n' + user.real_name + 'said: ' + trimmedMessage);
    }
});
 
slack.login();