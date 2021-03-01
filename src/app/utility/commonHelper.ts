import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { routeValues } from './route-name';
import { MatDialog } from '@angular/material/dialog';
import { SessionExpiryDialogComponent } from '../shared/session-expiry-dialog/session-expiry-dialog.component';
import { HttpWrapper } from '../utility/httpWrapper';
import { Subscription } from 'rxjs';
import { UserSecurity, UserSubSecurity } from 'src/app/models/UserSecurity';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class CommonHelper {
  private jwtHelper = new JwtHelperService();
  private expiry: any;
  public enableSpinner = false;
  public userSecurity = new UserSecurity();
  public userSubSecuritys = new Array<UserSubSecurity>();

  constructor(private router: Router, public dialog: MatDialog,
    private cookieService: CookieService) {

  }
  getUserName() {
    return localStorage.getItem('LoggedInUserName');
  }

  getToken() {
    var existToken = localStorage.getItem('Token');
    if (existToken == null || existToken == undefined || existToken == '') {
      existToken = this.getCookie('Aideaujeton');
      if (existToken == 'null') { this.SetTokenCookies(); existToken = null; }
      if (existToken != null && existToken != undefined && existToken != '') {
        localStorage.setItem('Token', existToken);
      }
    }
    else {
      this.SetTokenCookies(existToken);
    }
    return existToken;
  }
  getUserSecurites() {
    return localStorage.getItem("UserSecurites");
  }
  ValidateToken() {
    let result = true;
    this.expiry = localStorage.getItem('Expires');
    if (this.expiry !== null && this.expiry !== undefined && this.expiry !== ''
      && Date.parse(new Date().toString()) >= Date.parse(this.expiry)) {
      result = false;
      this.sessionExpiryDialog();
    }
    return result;
  }
  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('.', { skipLocationChange: false });
    return this.router.navigate(['/' + routeValues.tracking]);
  }
  logout() {
    window.localStorage.clear();
    this.SetTokenCookies();
    this.reload(this.router.url);
  }
  isValidEmail(email: string): boolean {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)) {
      return true;
    }
    return false;
  }
  isValidPhone(phone: string): boolean {
    if (/^[-xX+0-9]+$/.test(phone)) {
      return true;
    }
    return false;
  }
  utcToLocalDate(val: Date): Date {
    const d = new Date(val); // val is in UTC
    const localOffset = d.getTimezoneOffset() * 60000;
    const localTime = d.getTime() - localOffset;
    d.setTime(localTime);
    return d;
  }

  OrderBy(values: any[], fieldName: string, isDesc?: boolean) {
    return values.sort((a, b) => {
      const valueA = a[fieldName] ? a[fieldName] : '';
      const valueB = b[fieldName] ? b[fieldName] : '';
      if (valueA.toString().toLowerCase() < valueB.toString().toLowerCase()) {
        return -1 * (isDesc ? -1 : 1);
      }
      if (valueA.toString().toLowerCase() > valueB.toString().toLowerCase()) {
        return 1 * (isDesc ? -1 : 1);
      }
      return 0 * (isDesc ? -1 : 1);
    });
  }
  sessionExpiryDialog() {
    if (this.getToken()) {
      localStorage.clear();
      this.dialog.closeAll();
      const dialogRef = this.dialog.open(SessionExpiryDialogComponent, {
        width: '337px', height: '150px', disableClose: true
      });
      dialogRef.afterClosed().subscribe(message => {
        this.router.navigate(['/' + routeValues.login]);
      });
    }
  }
  public getCookie(cname: string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  public SetTokenCookies(token = null) {
    this.cookieService.set('Aideaujeton', token);
  }
}
