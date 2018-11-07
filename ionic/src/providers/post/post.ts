import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { File } from "@ionic-native/file";
import { Buffer } from 'buffer';
import { Storage } from 'aws-amplify';

/*
  Generated class for the PostProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
const API: string = "http://ec2-34-228-225-161.compute-1.amazonaws.com:8080/PictureYourself/";
@Injectable()
export class PostProvider {
  public photoId = -1;

  constructor(
    private file: File,
    public http: HttpClient) {
      console.log('Hello PostProvider Provider');
  }

  postImage(filePath, base64Image, cb) {
    const index = filePath.lastIndexOf('/') + 1;
    const dir = filePath.substring(0, index);
    const fileName = filePath.substring(index);

    const data = base64Image.substring(23);
    let buffer = new Buffer(data, 'base64');

    Storage.put(fileName, buffer, {
      contentType: "image/jpeg"
    })
    .then((result) => {
      console.log(JSON.stringify(result));
      let url = API + 'picture?photo=' + result["key"];
      console.log(url);
      fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(JSON.stringify(responseJson))
          this.photoId = responseJson.id
          cb()
        })
        .catch((error) => {
          console.error(error)
        })
    })
    .catch(err => console.log(err));
  }

}
