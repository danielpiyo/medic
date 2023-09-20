import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/shared-resources/auth/login/login.service';

@Component({
  selector: 'app-nurse-menu',
  templateUrl: './nurse-menu.page.html',
  styleUrls: ['./nurse-menu.page.scss'],
})
export class NurseMenuPage implements OnInit {
  constructor(private _logOutServive: LoginService, private _router: Router) {}

  ngOnInit() {}

  logOut() {
    this._logOutServive.logout();
    this._router.navigate(['/login']);
  }
}
