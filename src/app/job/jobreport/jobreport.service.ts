import { Injectable } from '@angular/core';
import { HttpWrapper } from 'src/app/utility/httpWrapper';
import { Subscription, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JobCardCondition } from 'src/app/models/JobCardCondition';
import { PagedDataInfo } from 'src/app/models/JobCardRequest';

@Injectable()
export class JobReportService {
  constructor(private httpWrapper: HttpWrapper, private http: HttpClient) {
  }
  PagedData(postData: PagedDataInfo, success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpPost(postData, 'JobAdvanceReport/PagedData', success, fail);
  }
  getCustomerDetails(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpPost(postData, 'Commons/PagedSelectedFields', success, fail);
  }
  getEntityDetailsByEntity(entity: string, success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpGet('JobAdvanceReport/AdvanceReport?entity=' + entity, success, fail);
  }
  getReportTypes(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpGet('Commons/IdRefLangNames?lookupId=' + postData + '&forceUpdate="false"', success, fail);
  }
}
