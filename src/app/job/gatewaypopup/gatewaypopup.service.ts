import { HttpWrapper } from 'src/app/utility/httpWrapper';
import { Subscription, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActionDetails } from 'src/app/models/ActionDetails';

@Injectable()
export class GatewayPopupService {
  constructor(private httpWrapper: HttpWrapper) {

  }
}
