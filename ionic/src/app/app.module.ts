import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from "@angular/common/http";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { WelcomePage } from "../pages/welcome/welcome";
import { TermPage } from "../pages/term/term";
import { Question_1Page } from "../pages/question-1/question-1";
import { InstructionPage } from "../pages/instruction/instruction";
import { SharePage } from "../pages/share/share";
import { SuccessPage } from "../pages/success/success";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from "@ionic-native/camera";
import { File } from "@ionic-native/file";
import { EmailComposer } from '@ionic-native/email-composer';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

import { PostProvider } from '../providers/post/post';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    WelcomePage,
    TermPage,
    Question_1Page,
    InstructionPage,
    SharePage,
    SuccessPage
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    WelcomePage,
    TermPage,
    Question_1Page,
    InstructionPage,
    SharePage,
    SuccessPage
  ],
  providers: [
    File,
    Camera,
    EmailComposer,
    UniqueDeviceID,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PostProvider
  ]
})
export class AppModule {}
