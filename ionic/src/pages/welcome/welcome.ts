import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TermPage } from "../term/term";

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  introToTerms() {
    console.log("introToTerms");
    this.navCtrl.push(TermPage);
  }

}
