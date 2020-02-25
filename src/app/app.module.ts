import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { GooglePlus } from '@ionic-native/google-plus/ngx';

import { environment } from 'src/environments/environment.prod';
import { NotasService } from './servicio/notas.service';
import { UiService } from './servicio/ui.service';
import { ModalPage } from './utils/modal/modal.page';
import { PopoverPage } from './utils/popover/popover.page';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';


// import { HideHeaderModule } from './directives/hide-header.module';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [ModalPage, PopoverPage],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    FormsModule,
    NgxQRCodeModule
  ],


  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NotasService,
    UiService,
    NativeStorage,
    GooglePlus,
    BarcodeScanner

  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
