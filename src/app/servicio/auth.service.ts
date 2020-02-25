import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User, LoginType } from 'src/modelo/user';
import { auth } from 'firebase';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})



export class AuthService {

  public isLogged: any = false;

  public logintype: number;

  constructor(public afAuth: AngularFireAuth,
    private googlePlus: GooglePlus,
    private local: NativeStorage,
    private router: Router
  ) {
    afAuth.authState.subscribe(user => (this.isLogged = user));
  }

  public async checkSession(): Promise<any> {
    if (!this.isLogged) {
      console.log("LOOOOOL")
      await this.local.getItem('autologin')
        .then(value => {
          console.log("LOOOOOL 2")
          if (value == true) {
            console.log("LOOOOOL 3")
            this.local.getItem('logintype')
              .then(value => {
                console.log(value);
                if (value == LoginType.EMAIL) {
                  this.local.getItem('user')
                    .then(userdata => {
                      this.isLogged = userdata;
                      this.logintype = LoginType.EMAIL;
                      this.router.navigateByUrl("/tabs");
                      console.log("LOOOOOL 4")
                    })
                    .catch(err => {
                      console.log(err);
                      console.log("LOOOOOL 5");
                    })
                    console.log("LOOOOOL 7")
                  
                }

                if (value == LoginType.GOOGLE) {
                  this.local.getItem('user')
                    .then(userdata => {
                      this.isLogged = userdata;
                      this.logintype = LoginType.GOOGLE;
                      console.log("ERERAREARAERARE")
                      this.router.navigateByUrl("/tabs");
                      
                    })
                    .catch( err => console.log(err))
                }
              })
              .catch(err => console.log(err))

          }
        })
        .catch(err => {
          console.log("ERROORRR");

          console.log(err)
        })

    }
  }

  onLoginEmailPassword(user: User): Promise<auth.UserCredential> {
    console.log("onLoginEmailPassword");
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
  }

  onRegisterEmailPassword(user: User) {
    return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  onTryLoginGoogle(): Promise<any> {
    console.log("onTryLoginGoogle");
    return this.googlePlus.trySilentLogin({ offline: false });
  }

  onLoginGoogle(): Promise<any> {
    console.log("onLoginGoogle");
    return this.googlePlus.login({});
  }


  onLogout(): Promise<any> {
    console.log("onLogoutSwitch");
    switch (this.logintype) {
      case LoginType.GOOGLE:
        console.log("switchGOOGLE");
        return this.onLogoutGoogle();

      case LoginType.EMAIL:
        console.log("switchEMAIL");
        return this.onLogoutEmail();

      case LoginType.NONE:
        console.log("switchNONE");
        return null;
    }
  }

  onLogoutGoogle(): Promise<any> {
    console.log("onLogoutGoogle");
    return this.googlePlus.logout();
  }

  onLogoutEmail(): Promise<void> {
    console.log("onLogoutEmail");
    return this.afAuth.auth.signOut();
  }

  saveSession(user: any, logintype: LoginType, remember: boolean) {
    console.log("Guardando credenciales")
    this.local.setItem('user', user);
    this.local.setItem('logintype', logintype);
    this.local.setItem('autologin', remember);
  }

  clearSession() {
    console.log("Limpiando credenciales")
    this.local.remove('user');
    this.local.remove('logintype');
    this.local.remove('autologin');
    this.isLogged = false;
  }

  getId() : string {
    if(this.logintype != LoginType.NONE){
      return this.isLogged.email;
    }
  }

}
