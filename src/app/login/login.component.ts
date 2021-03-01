import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { routeValues } from '../utility/route-name';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonHelper } from '../utility/commonHelper';
import { JsonPipe } from '@angular/common';
import { UserSecurity, UserSubSecurity } from 'src/app/models/UserSecurity';
import { from } from 'rxjs';
import { ActiveUser } from 'src/app/models/ActiveUser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public enableSpinner = false;
  public show_button = false;
  public show_eye = false;
  public copywriteYear: number = 2016;
  public userSecurity = new UserSecurity();
  public userSubSecuritys = new Array<UserSubSecurity>();
  public activeUser: ActiveUser[];
  public activeUserObj = new ActiveUser();

  constructor(private snackBar: MatSnackBar, private loginService: LoginService, private router: Router,
    private formBuilder: FormBuilder, private commonHelper: CommonHelper) {
  }

  ngOnInit() {
    this.copywriteYear = new Date().getFullYear();
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    if (this.commonHelper.getToken()) {
      this.router.navigate([routeValues.layout]);
      return;
    }
  }

  login() {
    var existToken = this.commonHelper.getToken();
    if (existToken != undefined && existToken != null && existToken != '') {
      localStorage.setItem('Token', existToken);
      this.commonHelper.SetTokenCookies(existToken);
      this.GetActiveUser();
      this.getUserSecurity();
      this.router.navigate(['/' + routeValues.m4pljobcard]);
    }
    else {
      const username = this.loginForm.get('userName').value;
      const password = this.loginForm.get('password').value;
      if (username === undefined || username.trim() === '') {
        this.snackBar.open('Please type username', 'Close', { duration: 3000 });
        return;
      }
      if (password === undefined || password.trim() === '') {
        this.snackBar.open('Please type password', 'Close', { duration: 3000 });
        return;
      }
      this.enableSpinner = true;
      const success = (res) => {
        this.enableSpinner = false;
        if (res.Results === null || res.Results === undefined) {
          this.snackBar.open('Invalid username or password.', 'Close', { duration: 3000 });
          return;
        }
        localStorage.setItem('Token', res.Results[0].access_token);
        this.commonHelper.SetTokenCookies(res.Results[0].access_token);
        localStorage.setItem('LoggedInUserName', username);
        localStorage.setItem('Expires', res.Results[0][".expires"]);
        this.GetActiveUser();
        this.getUserSecurity();
        this.router.navigate(['/' + routeValues.m4pljobcard]);
      }, fail = (err) => {
        this.enableSpinner = false;
        this.resetUserLogin();
        this.snackBar.open('Invalid username or password.', 'Close', { duration: 3000 });
      };

      const postData = {
        'Username': username,
        'Password': password,
        'ClientId': 'default',
      };
      if (this.loginForm.valid) {
        this.loginService.login(postData, success, fail);
      }
    }
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.login();
    }
  }

  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }

  redirectToTracking() {
    this.router.navigate(['/' + routeValues.tracking]);
  }
  getUserSecurity() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      if (res.Results.length > 0) {
        this.userSecurity = res.Results[0];
        if (this.userSecurity != null && this.userSecurity != undefined) {
          localStorage.setItem("UserSecurites", JSON.stringify(this.userSecurity));
        }
        else {
          this.resetUserLogin();
        }
      }
    }, fail = (err) => {
      this.enableSpinner = false;
      this.resetUserLogin();
    };
    this.loginService.getUserSecurities(success, fail);
  }

  resetUserLogin() {
    localStorage.clear();
    this.commonHelper.SetTokenCookies();
    this.router.navigate(['/' + routeValues.login]);
  }
  GetActiveUser() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      if (res.Results.length > 0) {
        this.activeUser = res.Results[0];
        if (this.activeUser != null && this.activeUser != undefined) {
          localStorage.setItem("GetActiveUser", JSON.stringify(this.activeUser));
          localStorage.setItem('LoggedInUserName', this.activeUser["UserName"]);
        }
      }
    }, fail = (err) => {
      this.enableSpinner = false;
    };
    this.loginService.GetActiveUser(success, fail);
  }
}
