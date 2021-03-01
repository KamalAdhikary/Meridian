import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GatewayPopupService } from './gatewaypopup.service';

@Component({
  selector: 'app-gatewaypopup',
  templateUrl: './gatewaypopup.component.html',
  styleUrls: ['./gatewaypopup.component.css']
})
export class GatewaypopupComponent implements OnInit {
  public actionText: string;
  public subActionText: string;
  public addtionalCommentText: string;
  public cargoQuantityText: number;
  public scheduleArrivalPlaceholder: string = '';
  public exceptionReasonCodePlaceholder: string = '';
  public isRescheduleCancel: boolean = false;
  public notesText: string;
  public contactMethodText: number;
  public phoneText: string;
  public emailText: string;
  public nameText: string;
  public statusCode: string;
  public time = '';
  public isScheduleReadOnly: boolean = false;
  public isReadOnly: boolean = false;
  public isNonPOC: boolean = false;
  public defaultLatestDDPNew: string;
  public defaultLatestDDPCurrent: string;
  public statusText: string;
  public exceptionText: string;
  public enableSpinner = false;
  public isDeliveryWindow: boolean = false;
  public isDropDownPanel: boolean = false;
  public isSchedule: boolean = false;
  public cargoText: string;
  public gatewayTypeId: number = 0;
  public jobId: number = 0;
  public customerId: number = 0;
  public titleText: string;
  public codeText: string;
  public checked = true;
  public ACD: string;

  constructor(private allDialogRef: MatDialog, private snackBar: MatSnackBar, private GatewayPopupService: GatewayPopupService) {
    let response = JSON.parse(localStorage.getItem("GatewayResponse"));
    this.jobId = response.jobId;
    this.gatewayTypeId = response.GatewayTypeId;
    this.notesText = response.GwyAddtionalComment;
    if (this.gatewayTypeId == 86) {
      this.actionText = response.GwyGatewayCode;
      this.subActionText = response.GwyGatewayTitle;
      this.nameText = response.GwyPerson;
      this.phoneText = response.GwyPhone;
      this.emailText = response.GwyEmail;

      this.defaultLatestDDPCurrent = this.getDate(response.GwyDDPCurrent);
      this.defaultLatestDDPNew = this.getDate(response.GwyDDPNew);
      this.isDeliveryWindow = this.actionText == 'Delivery Window' ? true : false;
      this.scheduleArrivalPlaceholder = this.getScheduleDatePlaceholder(this.actionText);
      if (this.actionText == 'Contacted' || this.actionText == 'Left Message' || this.subActionText == 'Product Damaged' || this.subActionText == 'Product Overage' || this.subActionText == 'Product Short')
        this.isNonPOC = true;
      else
        this.isNonPOC = false;
      this.isRescheduleCancel = (this.actionText == 'Reschedule' || this.actionText == 'Canceled') ? true : false;
      if (this.actionText == 'Schedule' || this.actionText == '3PL Arrival')
        this.isSchedule = true;
      else
        this.isSchedule = false;
      this.isDropDownPanel = response.IsSpecificCustomer &&
        (this.actionText == 'Reschedule' || this.actionText == 'Exception' || this.actionText == 'Canceled') ? true : false;
      this.exceptionReasonCodePlaceholder = this.actionText == 'Exception' ? 'Exception Reason' :
        ((this.actionText == 'Reschedule' || this.actionText == 'Canceled') ? 'Reason Code' : '');
      if (this.isDropDownPanel) {
        if (response.GwyCargoId != null && response.GwyCargoId > 0)
          this.cargoText = response.GwyCargoIdName;
        if (response.GwyExceptionTitleId != null && response.GwyExceptionTitleId > 0)
          this.statusText = response.GwyExceptionTitleIdName;
        if (response.GwyExceptionStatusId != null && response.GwyExceptionStatusId > 0)
          this.exceptionText = response.GwyExceptionStatusIdName;
      }
      const latestInPutTime = new Date(response.GwyUprDate).getTime();
      this.time = this.timeConvertion(latestInPutTime);
      this.contactMethodText = response.GwyPreferredMethodName != null ? response.GwyPreferredMethodName : 'Email';
    }
    else if (this.gatewayTypeId == 85) {
      this.codeText = response.GwyGatewayCode;
      this.titleText = response.GwyGatewayTitle;
      this.checked = response.GwyGatewayDefault;
      this.ACD = this.getDate(response.GwyGatewayACD);
    }
  }
  getDate(date: string) {
    if (date != null && date != undefined && date != '')
      return new Date(date).toISOString().split('T')[0];
    else
      return '';
  }
  ngOnInit(): void {
  }
  closeWindow() {
    this.allDialogRef.closeAll();
  }
  timeConvertion(time) {
    var date = new Date(parseInt(time));
    var localeSpecificTime = date.toLocaleTimeString();
    return localeSpecificTime.replace(/:\d+ /, ' ');
  }
  getScheduleDatePlaceholder(currentAction: string) {
    if (currentAction == 'Schedule' || currentAction == 'Reschedule')
      return 'Schedule Date';
    else if (this.actionText == '3PL Arrival')
      return 'Arrival Date';
    else if (this.actionText == 'Comment')
      return 'Comment Date';
    else if (this.actionText == 'EMail')
      return 'Email Date';
    else
      return '';
  }
}
