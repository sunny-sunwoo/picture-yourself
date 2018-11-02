
var socket = io("http://128.2.236.245:3000");

socket.on("disconnect", function() {
	console.log("Disconnected");
});

socket.on("connect", function() {
	console.log("Connected to Cyber Chat");
});

socket.on("bodyFrame", function(bodyFrame) {
	console.log(bodyFrame);
});
