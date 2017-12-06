/*globals require, console, process */

const express = require('express');
const app = express();
const env = require('./env.js');
const APIAI_TOKEN = env.APIAI_TOKEN;
const apiai = require('apiai')(APIAI_TOKEN);

app.use('/', express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images

const server = app.listen(process.env.PORT || 5000, function () {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const io = require('socket.io')(server);
io.on('connection', function (socket) {
    //console.log('a user connected');
    var session = Math.floor((Math.random() * 5000) + 1); // Create random number used for unique session
    socket.on('chat message', function (text) {


        // Get a reply from API.ai

        var apiaiReq = apiai.textRequest(text, {
            sessionId: session
        });

        apiaiReq.on('response', function (response) {
            var aiText = response.result.fulfillment.messages[0].speech;
            aiText = aiText.replace(/\n/g,'\<br>') // new line in html
            socket.emit('bot reply', aiText);
        });

        apiaiReq.on('error', function (error) {
            console.log(error);
        });

        apiaiReq.end();

    });
});