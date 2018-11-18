import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WelcomePage } from "../welcome/welcome";
import * as html2canvas from 'html2canvas';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SharePage');
  
  }

  backToWelcome() {
    this.navCtrl.setRoot(WelcomePage);
  }

  captureCanvas(){
 	html2canvas(document.getElementById('capture')).then(canvas => {
    	//document.body.appendChild(canvas)
    	var a = document.createElement('a');
    	a.href = canvas.toDataURL("image/png");
    	a.download = 'compiled.png';
    	a.click();
    	console.log('yay');
	});

  }
}
