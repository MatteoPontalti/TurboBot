/*globals require, console, process */

const express = require('express');
const app = express();
const env = require('./env.js');
bodyParser = require('body-parser');
const APIAI_TOKEN = env.APIAI_TOKEN;
const apiai = require('apiai')(APIAI_TOKEN);
const ArrayList = require('arraylist');

app.use('/', express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = app.listen(process.env.PORT || 5000, function () {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const io = require('socket.io')(server);
var sessionList = new ArrayList;
io.on('connection', function (socket) {
    //console.log('a user connected');
    var sessionId =uniqueSession(sessionList)

    socket.on('chat message', function (text) {

        var apiaiReq = apiai.textRequest(text, {
            sessionId: sessionId
        });
        //console.log(sessionId);
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
app.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Type', 'application/json');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
        return res.status(200).json({});
    }
    // make sure we go to the next routes
    next();
});

var api = express.Router();
api.post('/', function (req, res){
    var sessionId =uniqueSession(sessionList)
    var apiaiReq = apiai.textRequest(req.body.question, {
        sessionId: sessionId
    });
    //console.log(sessionId);
    apiaiReq.on('response', function (response) {
        var risposta = {Risposta: response.result.fulfillment.messages[0].speech}
        res.json(risposta)
        });
    apiaiReq.on('error', function (error) {
        console.log(error);
    });
    apiaiReq.end();
})

api.get('/:question', function (req, res){
    var sessionId =uniqueSession(sessionList)
    var apiaiReq = apiai.textRequest(req.params.question, {
        sessionId: sessionId
    });
    //console.log(sessionId);
    apiaiReq.on('response', function (response) {
        var risposta = {Domanda: req.params.question, Risposta: response.result.fulfillment.messages[0].speech}
        res.status=200
        res.json(risposta)
        });
    apiaiReq.on('error', function (error) {
        res.sendStatus(404)
        console.log(error);
    });
    apiaiReq.end();
})
app.use('/api', api);

function uniqueSession(sessionList){
    var session = Math.floor((Math.random() * 5000) + 1); // Create random number used for unique session
    while (sessionList.contains(session)) {
        session = Math.floor((Math.random() * 5000) + 1);
        sessionList.set(sessionList.size(), session);
    }
    //console.log(session)
    return session;
}
