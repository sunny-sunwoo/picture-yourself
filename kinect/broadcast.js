var Kinect2 = require("kinect2"),
    express = require("express"),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server);

var kinect = new Kinect2();

if (kinect.open()) {
    server.listen(3000);
    console.log("Server listening on port 3000");
    console.log("Point your browser to http://localhost:3000");

    // app.get('/', function(req, res) {
    //     res.sendFile(__dirname + '/public/index.html');
    // });
    app.use(express.static("./public"));

    kinect.on("bodyFrame", function(bodyFrame) {
        io.sockets.emit("bodyFrame", bodyFrame);
        // for(var i = 0;  i < bodyFrame.bodies.length; i++) {
        //     if(bodyFrame.bodies[i].tracked) {
        //         console.log(bodyFrame.bodies[i]);
        //     }
        // }
    })

    kinect.openBodyReader();
}