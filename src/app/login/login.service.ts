import { Injectable } from '@angular/core';
import { HttpWrapper } from '../utility/httpWrapper';
import { Subscription } from 'rxjs';

@Injectable()
export class LoginService {
  constructor(private httpWrapper: HttpWrapper) { }

  login(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpPost(postData, 'Account/Login', success, fail);
  }

  getUserSecurities(success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpPost(null, 'Commons/JobPermissions', success, fail);
  }

  GetActiveUser(success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpGet('Account/ActiveUser', success, fail);
  }
}
