import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WelcomePage } from "../welcome/welcome";
import { SuccessPage } from "../success/success";
import * as html2canvas from 'html2canvas';
import { PostProvider } from "../../providers/post/post";
import { EmailComposer } from '@ionic-native/email-composer';
import { ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Slides, Slide } from 'ionic-angular';

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
  @ViewChild(Slides) slides: Slides;
  @ViewChildren('capture') slds: QueryList<ElementRef>;
  public slideArr: ElementRef[];
  public currentIndex: number;

  constructor(
    private postProvider: PostProvider,
    private emailComposer: EmailComposer,
    public navCtrl: NavController,
    public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SharePage');
    this.slideArr = this.slds.toArray();
    this.currentIndex = 0;
  }

  backToWelcome() {
    this.navCtrl.setRoot(WelcomePage);
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex >= this.slides.length()) {
      currentIndex = this.slides.length() - 1;
    } else if (currentIndex < 0) {
      currentIndex = 0;
    }
    this.currentIndex = currentIndex;
    console.log('Current index is', currentIndex);
    console.log("slide " + this.slideArr[this.currentIndex]);
  }

  captureCanvas(){

   	html2canvas(this.slideArr[this.currentIndex].nativeElement).then(canvas => {
    //html2canvas(document.getElementById('capture' + this.currentIndex)).then(canvas => {
      	//document.body.appendChild(canvas)
      	//var a = document.createElement('a');
      	//a.href = canvas.toDataURL("image/png");
      	//a.download = 'compiled.png';
      	//a.click();
      	//console.log('yay');
        let image = canvas.toDataURL("image/jpeg");
        const data = 'base64:PictureYourself.jpg//' + image.substring(23);

        let e = {
          to: this.email,
          attachments: [
            data
          ],
          subject: 'PictureYourself',
          body: 'How are you? Nice greetings from PictureYourself',
          isHtml: true
        };

        this.emailComposer.open(e, () => {
          this.navCtrl.push(SuccessPage);
        });

        setTimeout(() => {
          this.navCtrl.push(SuccessPage);
        }, 3000);
  	}).catch((error) => {
      console.error(error)
    });

  }
}
