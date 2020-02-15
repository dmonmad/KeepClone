import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../servicio/auth.service';
import { User } from 'src/modelo/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  user: User = new User;

  public registroForm: FormGroup;

  error_messages = {
    'email': [{
      type: 'required',
      message: 'Se necesita un email.'
    },
    {
      type: 'email',
      message: 'Introduce un email válido.'
    }
    ],

    'password': [{
      type: 'required',
      message: 'Se necesita una contraseña.'
    },
    {
      type: 'minlength',
      message: 'Contraseña demasiado corta.'
    }
    ],
    'confirmPassword': [{
      type: 'passwordNotMatch',
      message: 'La contraseña no coincide'
    }
    ],
  }

  constructor(private formBuilder: FormBuilder,
    private authSvc: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.registroForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    }, {
      validators: this.password.bind(this)
    });
    
    if(this.authSvc.isLogged){
      this.router.navigateByUrl('/tabs');
    }

  }

  ionViewDidEnter(){
    if(this.authSvc.isLogged){
      this.router.navigateByUrl('/tabs');
    }
  }

  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('confirmPassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  onRegisterWithEmailAndPassword() {
    const user = this.authSvc.onRegisterEmailPassword(this.user);
    if (user) {

      console.log("Usuario creado");
      console.log(user);
      this.router.navigateByUrl('/');

    }

  }
  
  public goToLogin() {
    this.router.navigateByUrl('/login');
  }

}
