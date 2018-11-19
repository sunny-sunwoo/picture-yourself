import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WelcomePage } from "../welcome/welcome";
import * as html2canvas from 'html2canvas';
import { PostProvider } from "../../providers/post/post";
import { EmailComposer } from '@ionic-native/email-composer';

/**
 * Generated class for the SharePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-share',
  templateUrl: 'share.html',
})
export class SharePage {
	public base64Image: string;
  public email: string;

  constructor(
    private postProvider: PostProvider,
    private emailComposer: EmailComposer,
    public navCtrl: NavController,
    public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SharePage');

  }

  backToWelcome() {
    this.navCtrl.setRoot(WelcomePage);
  }

  captureCanvas(){
    let e = {
      to: this.email,
      attachments: [
        'base64:PictureYourself.jpg//' + this.postProvider.emailImage
      ],
      subject: 'PictureYourself',
      body: 'How are you? Nice greetings from PictureYourself',
      isHtml: true
    };

    this.emailComposer.open(e);

   	// html2canvas(document.getElementById('capture')).then(canvas => {
    //   	//document.body.appendChild(canvas)
    //   	var a = document.createElement('a');
    //   	a.href = canvas.toDataURL("image/png");
    //   	a.download = 'compiled.png';
    //   	a.click();
    //   	console.log('yay');
  	// });
  }
}
