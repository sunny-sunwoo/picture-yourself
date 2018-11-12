import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InstructionPage } from "../instruction/instruction";

/**
 * Generated class for the Question_1Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-question-1',
  templateUrl: 'question-1.html',
})
export class Question_1Page {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Question_1Page');
  }

  instruction(){
  	
      this.navCtrl.push(InstructionPage);
  }
}
