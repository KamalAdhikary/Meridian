import { HttpWrapper } from 'src/app/utility/httpWrapper';
import { Subscription, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { JobGatewayComment } from 'src/app/models/JobGatewayComment';

@Injectable()
export class GatewayService {
    constructor(private httpWrapper: HttpWrapper) {

    }
    getNextGateway(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
        return this.httpWrapper.genericHttpGet('Commons/GetJobGateway?jobId=' + postData, success, fail);
    }
    addGateway(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
        return this.httpWrapper.genericHttpPost(postData, 'JobGateways/SettingPost', success, fail);
    }
    insertComment(postData: JobGatewayComment, success: (resp) => void, fail: (err) => void): Subscription {
        return this.httpWrapper.genericHttpPost(postData, 'JobServices/InsertComment', success, fail);
    }
}