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
count2 = 0,
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
var charCount2 = 0;

// default character set
var charSet = [2, 12, 20];// index of CMU
var LETTER_SIZE = 3;
// var charSet2 = [22, 4, 11, 2, 14, 12, 4];
// var LETTER_SIZE2 = 7;
var answer1 = "";
var answer2 = "";

//animate test
var L = 30,
N = 100;

// create nodes
var positionList = [];
var positionList2 = [];
var urls = [];

var img = (Math.random() >= 0.2);

var data = {};
data.nodes = [];

var data2 = {};
data2.nodes = [];

var labelData = {};
labelData.q1 = ["USA", "India", "Korea", "China", "Taiwan", "HongKong", "Canada", "Japan"]; // length:8
labelData.q2 = ["FineArts", "Humanities", "InformationSystems",
"Science", "Engineering", "SocialScience", "PublicPolicy", "ComputerScience", "Business", "ETC"]; //length:10


// write json
var json = {}; // new  JSON Object
json.nodes = [];
json.edges = [];

var json2 = {}; // new  JSON Object
json2.nodes = [];
json2.edges = [];

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

function draw(newInput, newType) {
	count = 0;
	var charLength = LETTER_SIZE;
	charCount = 0;
	if (newInput) {
		charSet = newInput;
	}
	for (let i = positionList.length - 1; i >= 0; i--) {
		positionList.splice(i, 1);
	}
	console.log(positionList);
	console.log(charCount + ", " + charLength);
	pixelize(charCount, charLength);
	createSigmaObj(newType);
	noLoop();
}

function pixelize(currCount, currLength) {
	while(currCount < currLength) {
		var imgIndex = charSet[currCount];

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
					// image(imgFiles[i], currCount * 640 + x * scl, y * scl, w, w);
					// console.log(count + " // x: " + x * scl + "// y: " + y * scl);
					var positionPair = {
						x: currCount * 640 + x * scl, 
						y: y * scl
					}
					positionList.push(positionPair);
					count++;
				}
			}
		}
		currCount++;
	}
}

function createJSON(dataType, jsonType) {
	for (let i = dataType.nodes.length - 1; i >= 0; i--) {
		dataType.nodes.splice(i, 1);
	}
	for (let i = jsonType.nodes.length - 1; i >= 0; i--) {
		jsonType.nodes.splice(i, 1);
	}
	if(dataType == data) {
		for (i=0; i < count; i++){
			var temp1 = labelData.q1[Math.floor(Math.random() * labelData.q1.length)];
			var temp2 = labelData.q2[Math.floor(Math.random() * labelData.q2.length)];
		    var obj = {
		    	label: i,
		    	// comment out this line to change the label.
		        // label: "#" + temp1 + " #" + temp2,
		        id: 'n' +  i,
		        type: img ? 'image' : 'def',
		        url: img ? urls[Math.floor(Math.random() * urls.length)] : null,
		        q1_x: positionList[i].x,
		        q1_y: positionList[i].y,
		        q1_color: "#ddd",
		        q1_size: Math.random()*20 + 15,
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
		        random1_x: Math.random() * 1.5,
		        random1_y: Math.random(),
		        random1_size: Math.random(),
		        random1_color: '#ccc'
		   };
		   ['x', 'y', 'size', 'color'].forEach(function(val) {
		     obj[val] = obj['random1_' + val];
		   });
		   dataType.nodes.push(obj);
		}
	}
	if(dataType == data2) {
		for (i=0; i < count; i++){
			var temp1 = labelData.q1[Math.floor(Math.random() * labelData.q1.length)];
			var temp2 = labelData.q2[Math.floor(Math.random() * labelData.q2.length)];
		    var obj = {
		    	label: i,
		    	// comment out this line to change the label.
		        // label: "#" + temp1 + " #" + temp2,
		        id: 'n' +  i,
		        type: img ? 'image' : 'def',
		        url: img ? urls[Math.floor(Math.random() * urls.length)] : null,
		        q2_x: positionList[i].x,
		        q2_y: positionList[i].y,
		        q2_color: "#ddd",
		        q2_size: Math.random()*20 + 15,
		        random2_x: Math.random() * 1.5,
		        random2_y: Math.random(),
		        random2_size: Math.random(),
		        random2_color: '#ccc'
		   };
		   ['x', 'y', 'size', 'color'].forEach(function(val) {
		     obj[val] = obj['random2_' + val];
		   });
		   dataType.nodes.push(obj);
		}
	} 
	console.log(data.nodes);
	console.log(data2.nodes);
	for(i=0; i<count; i++) {
		jsonType.nodes[i] = dataType.nodes[i];
	}

	dataType.edges = [];
	for (let i = dataType.edges.length - 1; i >= 0; i--) {
		dataType.edges.splice(i, 1);
	}
	for (let i = jsonType.edges.length - 1; i >= 0; i--) {
		jsonType.edges.splice(i, 1);
	}

	
	for (i=0; i < count * edge_gen ; i++){
	   var obj = {
	       source: 'n' + ((Math.random() * count) | 0),
	       target: 'n' + ((Math.random() * count) | 0),
	       id: 'e' + i
	       // id: 'e' + i * i
	   }
	   dataType.edges.push(obj);
	}
	jsonType.edges = dataType.edges;
}

function createSigmaObj(currType){

	if(currType == "q1") {
		console.log("q1 type");
		createJSON(data, json);
	} 
	if(currType == "q2") {
		console.log("q2 type");
		createJSON(data2, json2);
	}
	
}

function updateJSON(combination, inputType) {
	var request = new XMLHttpRequest();
	var jsonData = {};
	if(inputType == "q1") {
		answer1 = combination.country;
	}
	if(inputType == "q2") {
		answer2 = combination.interest;
	}
	request.open('GET', 'http://ec2-34-228-225-161.compute-1.amazonaws.com:8080/PictureYourself/match?country=default', true);
	request.onload = function () {
		if(inputType == "q1") {
			console.log("first switch");
			switch(combination.country) {

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
			    // case "": 
				   //  charSet = [2, 12, 20]; // CMU
				   //  LETTER_SIZE = 3;
			    default:
			        charSet = [2, 12, 20]; // CMU
			        LETTER_SIZE = 3;
			        break;
			}
		}
		if(inputType == "q2") {
			console.log("second switch");
			switch(combination.interest) {

				// A	B	C	D	E	F	G	H	I	J	K	L	M	N	O	P	Q	R	S	T	U	V	W	X	Y	Z
				// 0	1	2	3	4	5	6	7	8	9	10	11	12	13	14	15	16	17	18	19	20	21	22	23	24	25

			    case "FineArts":
			        charSet = [5, 8, 13, 4, 0, 17, 19, 18]; // FINEARTS
			        LETTER_SIZE = 8;
			        break;
			    case "Humanities":
			        charSet = [3, 8, 4, 19, 17, 8, 2, 7]; // DIETRICH
			        LETTER_SIZE = 8;
			        break;
			    case "InformationSystems":
			        charSet = [7, 4, 8, 13, 25]; // HEINZ
			        LETTER_SIZE = 5;
			        break;
			    case "Science":
			        charSet = [12, 4, 11, 11, 14, 13]; // MELLON
			        LETTER_SIZE = 6;
			        break;
			    case "Engineering":
			        charSet = [4, 13, 6, 8, 13, 4, 4, 17]; // ENGINEER
			        LETTER_SIZE = 8;
			        break;
			    case "SocialScience":
			        charSet = [3, 8, 4, 19, 17, 8, 2, 7]; // DIETRICH
			        LETTER_SIZE = 8;
			        break;
			    case "PublicPolicy":
			        charSet = [7, 4, 8, 13, 25]; // HEINZ
			        LETTER_SIZE = 5;
			        break;
			    case "Business":
			        charSet = [19, 4, 15, 15, 4, 17]; // TEPPER
			        LETTER_SIZE = 6;
			        break;
			    case "ComputerScience":
			        charSet = [18, 2, 18]; // SCS
			        LETTER_SIZE = 3;
			        break;
			    default:
			        charSet = [22, 4, 11, 2, 14, 12, 4]; // WELCOME
			        LETTER_SIZE = 7;
			        break;
			}
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
		draw(charSet, inputType);
		// Begin accessing JSON data here
		jsonData = JSON.parse(this.response);

		// Add the new input data to the nodes.
		var lastIndex = jsonData.postList.length - 1;
		var newUrl = "https://s3.amazonaws.com/newpicbuck/public/" + jsonData.postList[lastIndex].photo;
		var index = Math.floor(Math.random() * count);
		currentIndex = index;


		
		// update label texts (instead of using "you're here")
		var currentLabel = "";
		if(answer1 != "default") {
			currentLabel += "#" + answer1;
			if(answer2 != null && inputType =="q2") {
				currentLabel += " #" + answer2;
			}
		}

		if(inputType == "q1") {
			json.nodes[index].url = newUrl;
			json.nodes[index].label = currentLabel;
		}

		if(inputType == "q2") {
			json2.nodes[index].url = newUrl;
			json2.nodes[index].label = currentLabel;
		}

		// saveJSON(json, 'data.json');
		if(inputType == "q2") {
			getJSON(json, json2, newUrl);
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
	var type = "";
	//fetchPictureList(payload.data);
	var input = payload.data;
	var obj = JSON.parse(input);
	// if(obj.country == "default") {
	// 	console.log("picture submitted");
	// }
	if(obj.country != "default" && obj.interest == null) {
		type = "q1";
		if(obj.country ==""){
			console.log("country skipped");
		}
		console.log(type);
		updateJSON(obj, type);
	} 
	if(obj.interest != null) {
		type = "q2";
		if(obj.interest == ""){
			console.log("interest skipped");
		}
		console.log(type);
		updateJSON(obj, type);
	}
}
