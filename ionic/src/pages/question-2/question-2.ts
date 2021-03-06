import { Component } from '@angular/core';
import { InstructionPage } from "../instruction/instruction";
import { NavController, NavParams } from 'ionic-angular';
import { PostProvider } from "../../providers/post/post";

/**
 * Generated class for the Question_2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-question-2',
  templateUrl: 'question-2.html',
})
export class Question_2Page {
  
  constructor(
  private postProvider: PostProvider,
  public navCtrl: NavController,
  public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Question_2Page');
  }

  goInstruction(event){
    console.log(event.srcElement.value);
    this.postProvider.answerInterest(event.srcElement.value, () => {
      this.navCtrl.push(InstructionPage);
    })
  }

}
