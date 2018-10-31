const HOST = "https://s3.amazonaws.com/picyoubucket/public/";
const IMAGES = document.querySelector("ul");

console.log(window.location.href);
var href = new URL(window.location.href);
var country = href.searchParams.get("country");
console.log(country);
if (!country)
  country = "korea";
fetchPictureList(country);
var nodes = [];

function fetchPictureList(country) {
  const url = "http://ec2-34-228-225-161.compute-1.amazonaws.com:8080/PictureYourself/match?country=" + country;
  fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      updateList(responseJson.postList)
    })
    .catch((error) => {
      console.error(error)
    })
}

function updateList(postList) {
  let len = nodes.length;
  for (let i = len - 1; i >= 0; i--) {
    IMAGES.removeChild(nodes[i]);
  }
  nodes = [];
  for (let i = 0; i < postList.length; i++) {
    let post = postList[i];
    var img = document.createElement("img");
    img.setAttribute("src", HOST + post.photo);
    img.setAttribute("style", "max-width:200px; max-height:200px;");
    IMAGES.append(img);
    var text = document.createTextNode(post.country);
    IMAGES.append(text);
    nodes.push(img);
    nodes.push(text);
  }
}

function checkUpdate() {
  const url = "http://ec2-34-228-225-161.compute-1.amazonaws.com:8080/PictureYourself/checkupdate";
  fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson)
      if (responseJson.update == 1) {
        fetchPictureList(responseJson.country);
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

var interval = setInterval(checkUpdate, 1000);
