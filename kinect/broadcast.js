var Kinect2 = require('kinect2'),
    express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app),
    server = app.listen(8000),
    io = require('socket.io').listen(server);

var kinect = new Kinect2();

if(kinect.open()) {
    console.log('Server listening on port 8000');

    app.get('/', function(req, res) {
        res.sendFile('http://127.0.0.1:8080');
    });

    kinect.on('bodyFrame', function(bodyFrame){
        io.sockets.emit('bodyFrame', bodyFrame);
		//console.log(bodyFrame);          
    });

    kinect.openBodyReader();
}