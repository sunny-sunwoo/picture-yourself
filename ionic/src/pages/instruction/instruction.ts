import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WelcomePage } from "../welcome/welcome";
import { SharePage } from "../share/share";

/**
 * Generated class for the InstructionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-instruction',
  templateUrl: 'instruction.html',
})
export class InstructionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InstructionPage');
  }

  backToWelcome() {
    this.navCtrl.setRoot(WelcomePage);
  }

  toShare(){
    this.navCtrl.setRoot(SharePage);
  }

}
