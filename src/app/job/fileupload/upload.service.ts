import { HttpWrapper } from 'src/app/utility/httpWrapper';
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

@Injectable()
export class UploadService {
  SERVER_URL: string = "";
  constructor(private httpWrapper: HttpWrapper, private http: HttpClient) {

  }
  getLookup(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpGet('Commons/IdRefLangNames?lookupId=' + postData + '&forceUpdate="false"', success, fail);
  }
  addDocReference(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.formDataHttpPost(postData, 'JobServices/UploadDocument', success, fail);
  }
}

