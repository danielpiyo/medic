import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/shared-resources/auth/login/login.service';
import { User } from 'src/app/shared-resources/types/type.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  currentUser!: User;
  constructor(private _logOutServive: LoginService, private _router: Router) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  ngOnInit(): void {
    console.log('Current User: ' + this.currentUser);
  }
  logOut() {
    this._logOutServive.logout();
    this._router.navigate(['/login']);
  }

  editProfile() {}
}
