var origImg,
convImg,
data,
fname,
fImg,
test,
imgFiles = [],
arr = [],
imgBrightness = [],
brightLevels = [];

var imageNumber = 74, 
w, 
h, 
count = 0, 
t = 0, 
centerImg, 
tempX, 
tempY, 
tempW;

// image scale : should be dynamic later.
// OrigImage.width/scl shouldn't have any floating point.
// OrigImage.height/scl shouldn't have any floating point.
// default img size for OrigImg: 640 * 640
var scl = 32; 

// refactoring for multiple images
var origImages = [];
var convImages = [];
var LETTER_NUM = 26; 
var charCount = 0;

//animate test
var L = 30,
N = 100;

// create nodes
var positionList = [];
var urls = [];

var img = (Math.random() >= 0.2);

var data = {};
data.nodes = [];

// write json
var json = {}; // new  JSON Object
json.nodes = [];

// preload
function preload() {
	for(var i = 0; i < LETTER_NUM; i++) {
		var currLetter = String.fromCharCode(i + 65);
		origImages[i] = loadImage(`mosaic/src/characters/edited-final/${currLetter}.png`);
	}
	data = loadJSON('mosaic/json/input.json');
	centerImg = loadImage('mosaic/src/headshot-2020/edited-square/21.png');
	for(var i = 0; i < imageNumber; i++) {
		imgFiles[i] = loadImage(`mosaic/src/img/${i}.png`);
	}
}

function setup() {
	createCanvas(origImages[0].width * 3, origImages[0].height);
	pixelDensity(1);
	w = origImages[0].width/scl;
	h = origImages[0].height/scl;
	for(var i = 0; i < LETTER_NUM; i++) {
		convImages[i] = createImage(w, h);
		convImages[i].copy(origImages[i], 0, 0, origImages[i].width, origImages[i].height, 0, 0, w, h);
		convImages[i].loadPixels();
	}
}

function draw() {
	var charLength = 3;

	while(charCount < charLength) {
		for(var y = 0; y < convImages[charCount].height; y++) {
			for(var x = 0; x < convImages[charCount].width; x++) {	
				var index = (x + y * convImages[charCount].width) * 4;
				var r = convImages[charCount].pixels[index];
				var g = convImages[charCount].pixels[index+1];
				var b = convImages[charCount].pixels[index+2];

				var bright = (r+g+b)/3;
				var w = map(bright, 0, 255, 0, scl);

				if(w != 0) {
					var i = Math.floor(Math.random() * imageNumber);
					// image(imgFiles[i], charCount * 640 + x * scl, y * scl, w, w);
					// console.log(count + " // x: " + x * scl + "// y: " + y * scl);
					var positionPair = {
						x: charCount * 640 + x * scl, 
						y: y * scl
					}
					positionList.push(positionPair);
					count++;
				}
			}
		}
		charCount++;
	}
	createSigmaObj();
	noLoop();
}

function createSigmaObj(){
	for (i=0; i < count ; i++){
	   var obj = {
	       label: i,
	       id: 'n' +  i,
	       type: img ? 'image' : 'def',
	       url: img ? urls[Math.floor(Math.random() * urls.length)] : null,
	       abc_x: positionList[i].x,
	       abc_y: positionList[i].y,
	       abc_color: "#ddd",
	       abc_size: Math.random()*20 + 15,
	       // circular_x: L * Math.cos(Math.PI * 2 * i / N - Math.PI / 2),
	       // circular_y: L * Math.sin(Math.PI * 2 * i / N - Math.PI / 2),
	       // circular_size: Math.random(),
	       // circular_color: '#ccc',
	       //   Math.floor(Math.random() * 16777215).toString(16) + '000000'
	       // ).substr(0, 6),
	       // grid_x: i % L,
	       // grid_y: Math.floor(i / L),
	       // grid_size: 1,
	       // grid_color: '#ccc',
	       random_x: Math.random() * 1.5,
	       random_y: Math.random(),
	       random_size: Math.random(),
	       random_color: '#ccc'
	   };
	   ['x', 'y', 'size', 'color'].forEach(function(val) {
	     obj[val] = obj['random_' + val];
	   });
	   data.nodes.push(obj);
	}

	for(i=0; i<count; i++) {
		json.nodes[i] = data.nodes[i + 100];
	}

	data.edges = []
	for (i=0; i < count * 2 ; i++){
	   var obj = {
	       source: 'n' + ((Math.random() * count) | 0),
	       target: 'n' + ((Math.random() * count) | 0),
	       id: 'e' + i
	       // id: 'e' + i * i
	   }
	   data.edges.push(obj)
	}
	// json.nodes = data.nodes;
	json.edges = data.edges;
	console.log(json);
	// saveJSON(json, 'data.json');

}

function updateJSON() {
	var request = new XMLHttpRequest();
	var jsonData = {};
	request.open('GET', 'http://ec2-34-228-225-161.compute-1.amazonaws.com:8080/PictureYourself/match?country=default', true);
	request.onload = function () {
	  // Begin accessing JSON data here
	  jsonData = JSON.parse(this.response);
	  var lastIndex = jsonData.postList.length - 1;
	  var newUrl = "https://s3.amazonaws.com/newpicbuck/public/" + jsonData.postList[lastIndex].photo;
	  var index = Math.floor(Math.random() * count);
	  currentIndex = index;
	  json.nodes[index].url = newUrl;
	 
	  // saveJSON(json, 'data.json');
	  getJSON(json, newUrl);
	}
	request.send();
}

const HOST = "https://s3.amazonaws.com/newpicbuck/public/";
const IMAGES = document.querySelector("ul");

// console.log(window.location.href);
var href = new URL(window.location.href);
var country = href.searchParams.get("country");
// console.log(country);
if (!country)
  country = "default";
fetchPictureList(country);
var nodes = [];

function fetchPictureList(country) {
  const url = "http://ec2-34-228-225-161.compute-1.amazonaws.com:8080/PictureYourself/match?country=" + country;
  fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
    	//initial json from api
      console.log(responseJson);
      for(var i = 1; i < responseJson.postList.length; i++){
      	eachUrl = "https://s3.amazonaws.com/newpicbuck/public/" + responseJson.postList[i].photo;
        urls.push(eachUrl);
      }
      console.log(urls);
      createSigmaObj();
      initialJSON(json);

      //updateList(responseJson.postList)
    })
    .catch((error) => {
      console.error(error)
    })
}

/*
function checkUpdate() {
  const url = "http://ec2-34-228-225-161.compute-1.amazonaws.com:8080/PictureYourself/checkupdate";
  fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.update == 1) {
      	console.log(responseJson)
        fetchPictureList(responseJson.country);
        updateJSON();
      }
    })
    .catch((error) => {
      console.error(error)
    })
}
*/

function checkUpdate() {
	ws.send("checkUpdate");
}

var interval = setInterval(checkUpdate, 1000);

var ws = new WebSocket("ws://ec2-34-228-225-161.compute-1.amazonaws.com:8080/WebSocket")

ws.onopen = function() {
  console.log("Connected to websocket server")
}

ws.onclose = function() {
  console.log("DISCONNECTED")
}

ws.onmessage = function(payload) {
  console.log(payload.data)
	//fetchPictureList(payload.data);
	updateJSON();
}
