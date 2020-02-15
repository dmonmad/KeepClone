import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../servicio/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authSvc : AuthService, 
    private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      if (!this.authSvc.isLogged && state.url === "/login" || state.url === "/register" ) {
        console.log(this.authSvc.isLogged);
        console.log("DEVOLVIENDO FALSE ISLOGGED")
        console.log(state.url);
        return true;
      } else if (this.authSvc.isLogged) {
        console.log(this.authSvc.isLogged);
        console.log("DEVOLVIENDO TRUE GUARD");
        console.log(state.url);
        return true;
      } else { 
        console.log(this.authSvc.isLogged);
        console.log("DEVOLVIENDO FALSE GUARD");
        console.log(state.url);
        return false;
      }
  }

}
