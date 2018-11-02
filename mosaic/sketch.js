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
scl = 32, 
w, 
h, 
count = 0, 
t = 0, 
centerImg, 
tempX, 
tempY, 
tempW;

//animate test
var L = 30,
N = 100;


// create nodes
var positionList = [];
var urls = [];
for(var i = 1; i <74; i++){
  urls.push('src/img/'+i+'.png');
}
var img = (Math.random() >= 0.2);

var data = {};
data.nodes = [];

// write json
var json = {}; // new  JSON Object
json.nodes = [];

// preload
function preload() {
	// origImg = loadImage('src/geo-map-world.png');
	origImg = loadImage('src/cmu-letter-4.png');
	// origImg = loadImage('src/pitt-letter.png');
	// origImg = loadImage('src/map.png');
	data = loadJSON('json/input.json');
	test = loadImage('src/img/20.png')
	centerImg = loadImage('src/headshot-2020/edited-square/21.png');
	for(var i = 0; i < imageNumber; i++) {
		imgFiles[i] = loadImage(`src/img/${i}.png`);
		// imgFiles[i] = loadImage(`src/headshot-2020/edited-square/${i}.png`);
	} 

}


function setup() {
	createCanvas(origImg.width, origImg.height);
	pixelDensity(1);
	w = origImg.width/scl;
	h = origImg.height/scl;
	convImg = createImage(w, h);
	convImg.copy(origImg, 0, 0, origImg.width, origImg.height, 0, 0, w, h);
	convImg.loadPixels();
	console.log(convImg);
}

function draw() {
	background(255);
	// image(test, 0, 0);
	

	for(var i = 0; i < imageNumber; i++) {
		imgFiles[i].loadPixels();
		var avg = 0;
		for(var j=0; j < imgFiles[i].pixels.length; j++) {
			var b = imgFiles[i].pixels[j];
			avg += b;
		}
		avg /= imgFiles[i].pixels.length;
		imgBrightness[i] = Math.floor(avg);
	} 
	console.log(imgFiles);
	console.log(imgBrightness);

	for(var i = 0; i < imageNumber; i++) {
		brightLevels[imgBrightness[i]] = i;
	}

	console.log(brightLevels);
	var xPos = 0;
	var yPos = 0;

	for(var y = 0; y < convImg.height; y++) {
		for(var x = 0; x < convImg.width; x++) {
			
			var index = (x + y * convImg.width) * 4;
			var r = convImg.pixels[index];
			var g = convImg.pixels[index+1];
			var b = convImg.pixels[index+2];

			var bright = (r+g+b)/3;

			var w = map(bright, 0, 255, 0, scl);

			if(w != 0) {
				var i = Math.floor(Math.random() * imageNumber);
				image(imgFiles[i], x * scl, y * scl, w, w);
				// if(count == 161) {
				// 	image(centerImg, x * scl, y * scl, w, w);
				// 	w = w * 1.4;
				// 	tempX = x * scl;
				// 	tempY = y * scl;
				// 	tempW = w * 1.4;
				// }

				console.log(count + " // x: " + x * scl + "// y: " + y * scl);
				var positionPair = {
					x: x * scl, 
					y: y * scl
				}
				positionList.push(positionPair);
				count++;
			}
		}
	}
	image(centerImg, tempX, tempY, tempW, tempW);
	var cc= 0;

	console.log(positionList);
	console.log(count);

	for (i=0; i < count ; i++){
	   var obj = {
	       label: i,
	       id: 'n' +  i,
	       type: img ? 'image' : 'def',
	       url: img ? urls[Math.floor(Math.random() * urls.length)] : null,
	       cmu_x: positionList[i].x,
	       cmu_y: positionList[i].y,
	       cmu_color: "#ddd",
	       cmu_size: Math.random()*20 + 15,
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
	   // cc++;
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


	var request = new XMLHttpRequest();
	var jsonData = {};
	request.open('GET', 'http://ec2-34-228-225-161.compute-1.amazonaws.com:8080/PictureYourself/match?country=default', true);
	request.onload = function () {
	  // Begin accessing JSON data here
	  jsonData = JSON.parse(this.response);
	  // console.log(jsonData);
	  var lastIndex = jsonData.postList.length - 1;
	  var url = "https://s3.amazonaws.com/newpicbuck/public/" + jsonData.postList[lastIndex].photo;
	  var index = Math.floor(Math.random() * count);
	  json.nodes[index].url = url;
	  // console.log(json.nodes[index]);
	  saveJSON(json, 'data.json');
	}
	request.send();
	
	noLoop();
}
