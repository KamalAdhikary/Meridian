import { Injectable } from '@angular/core';
import { HttpWrapper } from 'src/app/utility/httpWrapper';
import { Subscription, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JobCardCondition } from 'src/app/models/JobCardCondition';
import { PagedDataInfo } from 'src/app/models/JobCardRequest';

@Injectable()
export class JobCardService {
  constructor(private httpWrapper: HttpWrapper, private http: HttpClient) {
  }
  getCardTileDetails(postData: JobCardCondition, success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpPost(postData, 'JobCard/GetCardTileData', success, fail);
  }
  PagedData(postData: PagedDataInfo, success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpPost(postData, 'JobCard/PagedData', success, fail);
  }
  getDestinationDetails(CustomerId: number, success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpGet('JobCard/GetDropDownDataForJobCard?customerId=' + CustomerId, success, fail);
  }
  getCustomerDetails(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpPost(postData, 'Commons/PagedSelectedFields', success, fail);
  }
}
