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
var edge_gen = 2;

// refactoring for multiple images
var origImages = [];
var convImages = [];
var LETTER_NUM = 26; 
var charCount = 0;
var LETTER_SIZE = 3;

// default character set
var charSet = [2, 12, 20];// index of CMU

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
json.edges = [];

// preload
function preload() {
	for(var i = 0; i < LETTER_NUM; i++) {
		var currLetter = String.fromCharCode(i + 65);
		origImages[i] = loadImage(`mosaic/src/characters/edited-final/${currLetter}.png`);
	}
	centerImg = loadImage('mosaic/src/headshot-2020/edited-square/21.png');
	for(var i = 0; i < imageNumber; i++) {
		imgFiles[i] = loadImage(`mosaic/src/img/${i}.png`);
	}
}

function setup() {
	createCanvas(origImages[0].width * LETTER_SIZE, origImages[0].height);
	pixelDensity(1);
	w = origImages[0].width/scl;
	h = origImages[0].height/scl;
	
	for(var i = 0; i < LETTER_NUM; i++) {
		convImages[i] = createImage(w, h);
		convImages[i].copy(origImages[i], 0, 0, origImages[i].width, origImages[i].height, 0, 0, w, h);
		convImages[i].loadPixels();
	}
}

function draw(newInput) {
	count = 0;
	var charLength = LETTER_SIZE;
	charCount = 0;
	if (newInput) {
		charSet = newInput;
	}
	for (let i = positionList.length - 1; i >= 0; i--) {
		positionList.splice(i, 1);
	}
	// console.log(charSet);
	while(charCount < charLength) {
		var imgIndex = charSet[charCount];
		for(var y = 0; y < convImages[imgIndex].height; y++) {
			for(var x = 0; x < convImages[imgIndex].width; x++) {	
				var index = (x + y * convImages[imgIndex].width) * 4;
				var r = convImages[imgIndex].pixels[index];
				var g = convImages[imgIndex].pixels[index+1];
				var b = convImages[imgIndex].pixels[index+2];

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
	// console.log(count);
	createSigmaObj();
	noLoop();
}

function createSigmaObj(){
	for (let i = data.nodes.length - 1; i >= 0; i--) {
		data.nodes.splice(i, 1);
	}
	for (let i = json.nodes.length - 1; i >= 0; i--) {
		json.nodes.splice(i, 1);
	}
	for (i=0; i < count ; i++){
	   var obj = {
	       label: i,
	       id: 'n' +  i,
	       type: img ? 'image' : 'def',
	       url: img ? urls[Math.floor(Math.random() * urls.length)] : null,
	       typo_x: positionList[i].x,
	       typo_y: positionList[i].y,
	       typo_color: "#ddd",
	       typo_size: Math.random()*20 + 15,
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
		json.nodes[i] = data.nodes[i];
	}

	data.edges = [];
	for (i=0; i < count * edge_gen ; i++){
	   var obj = {
	       source: 'n' + ((Math.random() * count) | 0),
	       target: 'n' + ((Math.random() * count) | 0),
	       id: 'e' + i
	       // id: 'e' + i * i
	   }
	   data.edges.push(obj);
	}
	json.edges = data.edges;
	// console.log(data);
	// console.log(json);
	// saveJSON(json, 'data.json');

}

function updateJSON(combination) {
	var obj = JSON.parse(combination);
	console.log(obj);
	var request = new XMLHttpRequest();
	var jsonData = {};
	request.open('GET', 'http://ec2-34-228-225-161.compute-1.amazonaws.com:8080/PictureYourself/match?country=default', true);
	request.onload = function () {
		switch(obj.country) {

// A	B	C	D	E	F	G	H	I	J	K	L	M	N	O	P	Q	R	S	T	U	V	W	X	Y	Z
// 0	1	2	3	4	5	6	7	8	9	10	11	12	13	14	15	16	17	18	19	20	21	22	23	24	25

		    case "United States":
		        charSet = [20, 18, 0]; // USA
		        LETTER_SIZE = 3;
		        break;
		    case "India":
		        charSet = [8, 13, 3, 8, 0]; // IND
		        LETTER_SIZE = 5;
		        break;
		    case "Korea, Republic of":
		        charSet = [10, 14, 17, 4, 0]; // KOR
		        LETTER_SIZE = 5;
		        break;
		    case "China":
		        charSet = [2, 7, 8, 13, 0]; // CHN
		        LETTER_SIZE = 5;
		        break;
		    case "Taiwan, Province of China":
		        charSet = [19, 0, 8, 22, 0, 13]; // TWN
		        LETTER_SIZE = 6;
		        break;
		    case "Hong Kong":
		        charSet = [7, 14, 13, 6, 10, 14, 13, 6]; // HKG
		        LETTER_SIZE = 8;
		        break;
		    case "Italy":
		        charSet = [8, 19, 0, 11, 24]; // ITA
		        LETTER_SIZE = 5;
		        break;
		    case "Viet Nam":
		        charSet = [21, 8, 4, 19, 13, 0, 12]; // VNM
		        LETTER_SIZE = 7;
		        break;
		    case "Singapore":
		        charSet = [18, 8, 13, 6, 0, 15, 14, 17, 4]; // SGP
		        LETTER_SIZE = 9;
		        break;
		    case "Canada":
		        charSet = [2, 0, 13, 0 , 3, 0]; // CAN
		        LETTER_SIZE = 6;
		        break;
		    case "Japan":
		        charSet = [9, 0, 15, 0, 13]; // JPN
		        LETTER_SIZE = 5;
		        break;
		    case "United Kingdom":
		        charSet = [6, 1, 17]; // GBR
		        LETTER_SIZE = 3;
		        break;
		    case "": 
			    charSet = [2, 12, 20]; // CMU
			    LETTER_SIZE = 3;
		    default:
		        // charSet = [2, 12, 20]; // CMU
		        // LETTER_SIZE = 3;
		        break;
		}
		if(LETTER_SIZE > 5) {
			scl = 64;
			edge_gen = 1.5;
			setup();
		} else {
			scl = 32;
			edge_gen = 2;
			setup();
		}
		// console.log(combination);
		draw(charSet);
		// Begin accessing JSON data here
		jsonData = JSON.parse(this.response);
		var lastIndex = jsonData.postList.length - 1;
		var newUrl = "https://s3.amazonaws.com/newpicbuck/public/" + jsonData.postList[lastIndex].photo;
		var index = Math.floor(Math.random() * count);
		currentIndex = index;
		json.nodes[index].url = newUrl;
		
		if(obj.country != "default"){
			// saveJSON(json, 'data.json');
			getJSON(json, newUrl);
		} else {
			console.log("cmu animation removed");
		}
		
	}
	request.send();
}

const HOST = "https://s3.amazonaws.com/newpicbuck/public/";
const IMAGES = document.querySelector("ul");

var href = new URL(window.location.href);
var country = href.searchParams.get("country");
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
      // console.log(responseJson);
      for(var i = 1; i < responseJson.postList.length; i++){
      	eachUrl = "https://s3.amazonaws.com/newpicbuck/public/" + responseJson.postList[i].photo;
        urls.push(eachUrl);
      }
      // console.log(urls);
      createSigmaObj();
      initialJSON(json);
    })
    .catch((error) => {
      console.error(error)
    })
}

function checkUpdate() {
	ws.send("checkUpdate");
}

var interval = setInterval(checkUpdate, 1000);

var ws = new WebSocket("ws://ec2-34-228-225-161.compute-1.amazonaws.com:8080/WebSocket");

ws.onopen = function() {
  console.log("Connected to websocket server");
}

ws.onclose = function() {
  console.log("DISCONNECTED");
}

ws.onmessage = function(payload) {
  console.log(payload.data);
	//fetchPictureList(payload.data);
	updateJSON(payload.data);
}
