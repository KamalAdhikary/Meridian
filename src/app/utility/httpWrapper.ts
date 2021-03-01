import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Subscription, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CommonHelper } from './commonHelper';
// import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';

@Injectable()
export class HttpWrapper {
  private baseURL: string = environment.baseURL;
  constructor(private httpClientModule: HttpClient, private router: Router, private commonHelper: CommonHelper) {

  }

  /**
   * Generic method for making HTTP GET call.
   * @param  string destinationUrl is the end point API for which get call has to be made.
   * @param  (response:any)=>void success is the callback which will be triggered when API call is successful.
   * @param  (err:any)=>void fail is the callback which will be triggered when API call is failed.
   * @returns Subscription
   */
  public genericHttpGet(destinationUrl: string, success: (response: any) => void, fail: (err: any) => void): Subscription {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    let accessToken = this.commonHelper.getToken();
    if (accessToken != null && accessToken != undefined && accessToken != '')
      headers = headers.append('Authorization', 'bearer ' + accessToken);
    const httpOptions = { headers: headers };
    return this.httpClientModule.get(this.baseURL + destinationUrl, httpOptions).subscribe(response => {
      success(response);
    },
      err => {
        this.handleError(err);
        fail(err);
      });
  }

  /**
   * Generic method for making HTTP POST call.
   * @param  any postData is the JSON data which needs to be posted
   * @param  string destinationUrl is the end point API for which get call has to be made.
   * @param  (response:any)=>void success is the callback which will be triggered when API call is successful.
   * @param  (err:any)=>void fail is the callback which will be triggered when API call is failed.
   * @returns Subscription
   */
  public genericHttpPost(postData: any, destinationUrl: string, success: (response: any) => void,
    fail: (err: any) => void): Subscription {

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    const accessToken = this.commonHelper.getToken();
    if (accessToken) {
      headers = headers.append('Authorization', 'bearer ' + accessToken);
    }

    const httpOptions = { headers: headers };
    postData = postData !== null ? postData : null;
    return this.httpClientModule.post(this.baseURL + destinationUrl, postData, httpOptions).subscribe(response => {
      success(response);
    },
      err => {
        this.handleError(err);
        fail(err);
      });
  }

  /**
  * Generic method for making HTTP PUT call.
  * @param  any postData is the JSON data which needs to be posted
  * @param  string destinationUrl is the end point API for which get call has to be made.
  * @param  (response:any)=>void success is the callback which will be triggered when API call is successful.
  * @param  (err:any)=>void fail is the callback which will be triggered when API call is failed.
  * @returns Subscription
  */
  public genericHttpPut(postData: any, destinationUrl: string, success: (response: any) => void, fail: (err: any) => void): Subscription {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');

    const accessToken = this.commonHelper.getToken();
    if (accessToken) {
      headers = headers.append('Authorization', 'bearer ' + accessToken);
    }

    const httpOptions = { headers: headers };
    postData = postData !== null ? postData : null;
    return this.httpClientModule.put(this.baseURL + destinationUrl, postData, httpOptions).subscribe(response => {
      success(response);
    },
      err => {
        this.handleError(err);
        fail(err);
      });
  }

  /**
  * Generic method for making HTTP DELETE call.
  * @param  string destinationUrl is the end point API for which get call has to be made.
  * @param  (response:any)=>void success is the callback which will be triggered when API call is successful.
  * @param  (err:any)=>void fail is the callback which will be triggered when API call is failed.
  * @returns Subscription
  */
  public genericHttpDelete(postData: any, destinationUrl: string, success: (response: any) => void,
    fail: (err: any) => void): Subscription {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');

    const accessToken = this.commonHelper.getToken();
    if (accessToken) {
      headers = headers.append('Authorization', 'bearer ' + accessToken);
    }

    const httpOptions = { headers: headers, observe: postData };
    return this.httpClientModule.delete(this.baseURL + destinationUrl, httpOptions).subscribe(response => {
      success(response);
    },
      err => {
        this.handleError(err);
        fail(err);
      });
  }

  /**
  * Generic method for making HTTP PATCH call.
  * @param  any postData is the JSON data which needs to be posted
  * @param  string destinationUrl is the end point API for which get call has to be made.
  * @param  (response:any)=>void success is the callback which will be triggered when API call is successful.
  * @param  (err:any)=>void fail is the callback which will be triggered when API call is failed.
  * @returns Subscription
  */
  public genericHttpPatch(postData: any, destinationUrl: string, success: (response: any) => void,
    fail: (err: any) => void): Subscription {

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');

    const accessToken = this.commonHelper.getToken();
    if (accessToken) {
      headers = headers.append('Authorization', 'bearer ' + accessToken);
    }

    const httpOptions = { headers: headers };
    postData = postData !== null ? postData : null;
    return this.httpClientModule.patch(this.baseURL + destinationUrl, postData, httpOptions).subscribe(response => {
      success(response);
    },
      err => {
        this.handleError(err);
        fail(err);
      });
  }

  /**
   * Generic method for making HTTP GET call.
   * @param  string destinationUrl is the end point API for which get call has to be made.
   * @param  (response:any)=>void success is the callback which will be triggered when API call is successful.
   * @param  (err:any)=>void fail is the callback which will be triggered when API call is failed.
   * @returns Subscription
   */
  public genericHttpGetObservable(destinationUrl: string): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');

    const accessToken = this.commonHelper.getToken();
    if (accessToken) {
      headers = headers.append('Authorization', 'bearer ' + accessToken);
    }

    const httpOptions = { headers: headers };

    return this.httpClientModule.get<any>(destinationUrl, httpOptions);
  }

  public formDataHttpPost(postData: any, destinationUrl: string, success: (response: any) => void,
    fail: (err: any) => void): Subscription {
    let headers: HttpHeaders = new HttpHeaders();

    const accessToken = this.commonHelper.getToken();
    if (accessToken) {
      headers = headers.append('Authorization', 'bearer ' + accessToken);
    }

    const httpOptions = { headers: headers };
    postData = postData !== null ? postData : null;

    return this.httpClientModule.post(this.baseURL + destinationUrl, postData, httpOptions)
      .pipe(map((res: Response) => res))
      .subscribe
      (
        response => {
          success(response);
        },
        err => {
          // this.handleError(err);
          fail(err);
        }
      );
  }
  // return this.httpClientModule.post(this.baseURL + destinationUrl, postData, httpOptions).subscribe(response => {
  //     success(response);
  // },
  //     err => {
  //         this.handleError(err);
  //         fail(err);
  //     });


  /**
   * Method used to handle common functionality during error.
   * @param  HttpErrorResponse err
   */
  private handleError(err: HttpErrorResponse) {
    switch (err.status) {
      case 403:
        break;
      case 401: // Unauthorized
        this.commonHelper.sessionExpiryDialog();
        break;
      case 404:
        // this.commonHelper.sessionExpiryDialog();
        break;
      default:
        break;
    }
  }
}
