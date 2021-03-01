import { HttpWrapper } from 'src/app/utility/httpWrapper';
import { Subscription, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class TrackingService {
    constructor(private httpWrapper: HttpWrapper) {

    }
    Search(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
        return this.httpWrapper.genericHttpGet('JobServices/GetSearchOrder?search=' + postData, success, fail);
    }
}
