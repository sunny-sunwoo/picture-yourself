import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from "../home/home";

/**
 * Generated class for the TermPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-term',
  templateUrl: 'term.html',
})
export class TermPage {
  public checked = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermPage');
  }

  handleCheckbox() {
    this.checked = !this.checked;
  }

  termsToCamera() {
    this.navCtrl.push(HomePage);
  }

}
