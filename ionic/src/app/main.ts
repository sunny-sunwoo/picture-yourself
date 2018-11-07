import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';
import Amplify from 'aws-amplify';
import amplify from '../aws-exports';
Amplify.configure(amplify);

platformBrowserDynamic().bootstrapModule(AppModule);
