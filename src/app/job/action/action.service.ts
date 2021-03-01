import { HttpWrapper } from 'src/app/utility/httpWrapper';
import { Subscription, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActionDetails } from 'src/app/models/ActionDetails';
import { JobGatewayComment } from 'src/app/models/JobGatewayComment';

@Injectable()
export class ActionService {
    constructor(private httpWrapper: HttpWrapper) {

    }
    getActionByJobId(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
        return this.httpWrapper.genericHttpGet('Commons/JobAction?jobId=' + postData + '&entity="JobGateway"', success, fail);
    }

    getActionDetails(postData: ActionDetails, success: (resp) => void, fail: (err) => void): Subscription {
        return this.httpWrapper.genericHttpGet('JobGateways/GatewayWithParent?id=' + postData.Id + '&parentId=' + postData.JobId +
            '&entityFor=' + postData.EntityFor + '&is3PlAction=' + postData.Is3PlAction + '&gatewayCode=' + postData.GatewayCode, success, fail);
    }
    getCargoDetails(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
        return this.httpWrapper.genericHttpPost(postData, 'Commons/PagedSelectedFields', success, fail);
    }
    getInstallStatusDetails(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
        return this.httpWrapper.genericHttpPost(postData, 'Commons/PagedSelectedFields', success, fail);
    }
    addAction(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
        return this.httpWrapper.genericHttpPost(postData, 'JobGateways/SettingPost', success, fail);
    }
    getContactMethods(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
        return this.httpWrapper.genericHttpGet('Commons/IdRefLangNames?lookupId=' + postData + '&forceUpdate="false"', success, fail);
    }
    insertComment(postData: JobGatewayComment, success: (resp) => void, fail: (err) => void): Subscription {
        return this.httpWrapper.genericHttpPost(postData, 'JobServices/InsertComment', success, fail);
    }
}


