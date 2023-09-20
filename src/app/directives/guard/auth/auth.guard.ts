import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/shared-resources/auth/login/login.service';
import { User } from 'src/app/shared-resources/types/type.model';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  loginUser!: User;
  constructor(private router: Router, private loginService: LoginService) {
    this.loginUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (localStorage.getItem('currentToken')) {
      this.loginService.setUserLoggedIn(true);
      return true;
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
