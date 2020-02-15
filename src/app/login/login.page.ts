import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../servicio/auth.service';
import { UiService } from '../servicio/ui.service';
import { User, LoginType } from 'src/modelo/user';
import { NativeStorage } from '@ionic-native/native-storage/ngx'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user: User = new User;

  remember : boolean;

  public loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private authSvc: AuthService,
    private router: Router,
    private ui: UiService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
      remember: [undefined]
    });

    if (this.authSvc.isLogged) {
      this.router.navigateByUrl('/tabs');
    }

  }

  ionViewDidEnter() {
    if (this.authSvc.isLogged) {
      this.router.navigateByUrl('/tabs');
    }
  }

  async onLogin() {
    await this.ui.showLoading("Cargando...");
    console.log("Loading creado");
    this.authSvc.onLoginEmailPassword(this.user)
      .then(() => {
        this.ui.hideLoad();
        this.authSvc.saveSession(this.user, LoginType.EMAIL, this.remember);
        this.authSvc.isLogged = this.user;
        this.authSvc.logintype = LoginType.EMAIL;
        this.router.navigateByUrl('/tabs');
      })
      .catch(err => {
        console.log("Peta");
        this.ui.hideLoad();
        this.ui.presentToast(err, 4000, "danger");
      })
    console.log("Sale");

  }

  async onLoginGoogle() {
    await this.ui.showLoading("Cargando...");
    this.authSvc.onTryLoginGoogle()
      .then(res => {
        this.ui.hideLoad();
        console.log("##########################");
        console.log(res);
        this.authSvc.saveSession(res, LoginType.GOOGLE, this.remember);
        this.authSvc.logintype = LoginType.GOOGLE;
        this.authSvc.isLogged = res;
        this.router.navigateByUrl('/tabs');
      })
      .catch(err => {
        console.log("Error aqui 3");
        console.log(err);
        this.authSvc.onLoginGoogle()
          .then(res => {
            this.authSvc.saveSession(res, LoginType.GOOGLE, this.remember);
            this.authSvc.logintype = LoginType.GOOGLE;
            this.authSvc.isLogged = res;
            this.ui.hideLoad();
            this.router.navigateByUrl('/tabs');
          })
          .catch(err => {
            this.ui.hideLoad();
            this.authSvc.clearSession();
            this.ui.presentToast(err, 4000, "danger");
          })

      })
  }

  public goToRegister() {
    this.router.navigateByUrl('/register');
  }

}
