import { HttpWrapper } from 'src/app/utility/httpWrapper';
import { Subscription, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { PagedDataInfo } from 'src/app/models/JobCardRequest';
import { ActionDetails } from 'src/app/models/ActionDetails';

@Injectable()
export class OrderdetailsService {
  constructor(private httpWrapper: HttpWrapper) {

  }
  getOrderDetailsById(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpGet('JobServices/GetOrderDetailsById?Id=' + postData, success, fail);
  }
  getGatewayDetailsById(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpGet('JobServices/GetGatewayDetailsByJobID?Id=' + postData, success, fail);
  }
  getJobDocumentDetailsById(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpGet('JobServices/GetDocumentDetailsByJobID?Id=' + postData, success, fail);
  }
  getDownloadDocumentByJobId(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpGet('Attachments/Get?id=' + postData, success, fail);
  }
  cargoDetails(postData: PagedDataInfo, success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpPost(postData, 'JobCargos/PagedData', success, fail);
  }
  priceDetails(postData: PagedDataInfo, success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpPost(postData, 'JobBillableSheets/PagedData', success, fail);
  }
  costDetails(postData: PagedDataInfo, success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpPost(postData, 'JobCostSheets/PagedData', success, fail);
  }
  XCBLDetails(postData: PagedDataInfo, success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpPost(postData, 'JobEDIXcbl/PagedData', success, fail);
  }
  jobNotes(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpGet('Jobs/GetJobNotes?jobId=' + postData, success, fail);
  }
  updateDriverAlert(postData: any, success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpPost(postData,'Jobs/UpdateDriverAlert', success, fail);
  }
  editGateway(postData: ActionDetails, success: (resp) => void, fail: (err) => void): Subscription {
    return this.httpWrapper.genericHttpGet('JobGateways/GatewayWithParent?id=' + postData.Id + '&parentId=' + postData.JobId +
      '&entityFor=' + postData.EntityFor + '&is3PlAction=' + postData.Is3PlAction + '&gatewayCode=' + postData.GatewayCode, success, fail);
  }
}


