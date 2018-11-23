import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Question_2Page } from "../question-2/question-2";
import { PostProvider } from "../../providers/post/post";

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
  public country = "";

  constructor(
    private postProvider: PostProvider,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Question_1Page');
  }

  nextQuestion(){
    console.log("answerQuestion", this.country);
    this.postProvider.answerQuestion(this.country, () => {
      this.navCtrl.push(Question_2Page);
    })
      //this.navCtrl.push(InstructionPage);
  }
}
