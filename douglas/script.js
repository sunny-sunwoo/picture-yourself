const HOST = "https://s3.amazonaws.com/picyoubucket/public/";
const IMAGES = document.querySelector("ul");

console.log(window.location.href);
var href = new URL(window.location.href);
var country = href.searchParams.get("country");
console.log(country);

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

function updateList(postList) {
  for (var i = 0; i < postList.length; i++) {
    let post = postList[i];
    var img = document.createElement("img");
    img.setAttribute("src", HOST + post.photo);
    img.setAttribute("style", "max-width:200px; max-height:200px;");
    IMAGES.append(img);
    IMAGES.append(post.country);
  }
}
