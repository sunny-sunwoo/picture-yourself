import { Storage } from 'aws-amplify';
import RNFetchBlob from 'react-native-fetch-blob';
import { Buffer } from 'buffer';
import { Platform } from 'react-native';

export default class PostStore {
  constructor(rootStore) {
    this.rootStore = rootStore
    this.photoId = -1
    this.country = ''
    this.host = 'http://ec2-34-228-225-161.compute-1.amazonaws.com:8080/PictureYourself/'
  }
  get PhotoId() {
    return this.photoId
  }
  get Country() {
    return this.country
  }
  add(url) {
    let post = {created: Date.now(), url: url}
    console.log("add", url)
  }
  readFile(filePath) {
    return RNFetchBlob.fs.readFile(filePath, 'base64')
      .then(data => new Buffer(data, 'base64'));
  }
  answerQuestion(text, cb) {
    this.country = text
    let url = this.host
              + 'question?country='
              + text
              + '&id='
              + this.photoId
    console.log(url)
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        cb(responseJson.ok)
      })
      .catch((error) => {
        console.error(error)
      })
  }
  postImage(img, cb) {
    let uri = img.uri
    let filePath = '';
    if (Platform.OS === 'ios') {
      let arr = uri.split('/')
      const dirs = RNFetchBlob.fs.dirs
      img.fileName = arr[arr.length - 1]
      img.type = 'image/jpg'
      filePath = `${dirs.DocumentDir}/image/${arr[arr.length - 1]}`
    } else {
      filePath = uri
    }
    console.log("postImage", img, filePath)
    this.readFile(filePath).then(buffer => {
      Storage.put(img.fileName, buffer, {
        contentType: img.type
      })
      .then((result) => {
        console.log(result)
        let url = this.host
                  + 'picture?photo='
                  + result.key
        console.log(url)
        fetch(url)
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson)
            this.photoId = responseJson.id
            cb()
          })
          .catch((error) => {
            console.error(error);
          })
      })
      .catch(err => console.log(err))
    })
    .catch(e => {
      console.log(e);
    });
  }
}
