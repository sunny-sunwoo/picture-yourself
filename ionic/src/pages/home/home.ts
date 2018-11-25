import { Component } from '@angular/core';
import { NavController, normalizeURL } from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { PostProvider } from "../../providers/post/post";
import { File } from "@ionic-native/file";
import { Question_1Page } from "../question-1/question-1";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public base64Image: string;
  public filePath: string;
  picture: string;

  constructor(
    private file: File,
    private postProvider: PostProvider,
    private camera: Camera,
    public navCtrl: NavController) {

  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter");
    this.takePicture();
  }

  takePicture(){
  const options: CameraOptions = {
      //quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      cameraDirection: this.camera.Direction.FRONT,
      correctOrientation: true
    }

    this.camera.getPicture(options)
      .then(imageData => {
        console.log(imageData);
        //this.base64Image = 'data:image/jpeg;base64,' + imageData;
        this.filePath = imageData;
        //this.base64Image = normalizeURL(imageData);
        const index = imageData.lastIndexOf('/') + 1;
        const dir = imageData.substring(0, index);
        const fileName = imageData.substring(index);
        this.file.readAsDataURL(dir, fileName)
          .then(res => {
            this.postProvider.base64Image = res;
          })
          .catch(err => console.log(err));
      }, err => {
        console.log(err);
      });

  }

  share() {
    this.postProvider.postImage(this.filePath, this.postProvider.base64Image, () => {
      console.log('postImageComplete');
      this.navCtrl.push(Question_1Page);
    });
  }

  tryAgain() {
    this.takePicture();
  }

}
