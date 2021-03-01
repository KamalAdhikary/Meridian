import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionService } from './action.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JobAction } from 'src/app/models/JobAction';
import { OrderPassingModel } from 'src/app/models/OrderDetails';
import { DropDownInfo, EntitiesAlias, CargoModel, InstallStatusModel, ExceptionModel } from 'src/app/models/DropDownInfo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs/Observable';
import { startWith, map } from 'rxjs/operators';
import { Time } from '@angular/common';
import { CommonHelper } from 'src/app/utility/commonHelper';
import { routeValues } from 'src/app/utility/route-name';
import { ActionDetails } from 'src/app/models/ActionDetails';
import { ActionModel } from 'src/app/models/ActionModel';
import { SysOption } from 'src/app/models/SysOption';
import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { JobGatewayComment } from 'src/app/models/JobGatewayComment';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  //#region Properties declartion and instillation
  public jobId: string;
  public enableSpinner = false;
  public multipleActions: JobAction[] = [];
  public actionForm: FormGroup;
  public actionText: string;
  public subActionText: string;
  public actionList: JobAction[] = [];
  public subActionList: JobAction[] = [];
  public filteredAction: Observable<JobAction[]>;
  public filteredSubAction: Observable<JobAction[]>;
  public isTemplateShow: boolean = false;
  public isSchedule: boolean = false;
  public orderPassingModel: OrderPassingModel;
  public isElectroluxCustomer = false;
  public dropdownInfo: DropDownInfo;
  public cargoText: string;
  public filteredCargo: Observable<CargoModel[]>;
  public cargoList: CargoModel[] = [];
  public statusText: string;
  public filteredStatus: Observable<InstallStatusModel[]>;
  public installStatusList: InstallStatusModel[] = [];
  public exceptionText: string;
  public filteredException: Observable<ExceptionModel[]>;
  public exceptionList: ExceptionModel[] = [];
  public isDeliveryWindow: boolean = false;
  public isDropDownPanel: boolean = false;
  public addtionalCommentText: string;
  public cargoQuantityText: number;
  public scheduleArrivalPlaceholder: string = '';
  public exceptionReasonCodePlaceholder: string = '';
  public isRescheduleCancel: boolean = false;
  public currentDate: Date = new Date();
  public actionDetails = new ActionDetails;
  public actionModel = new ActionModel();
  public isCollapsed = false;
  public notesText: string;
  public contactMethodText: number;
  public phoneText: string;
  public emailText: string;
  public contactMethods: SysOption[];
  public nameText: string;
  public statusCode: string;
  public time = '';
  public isScheduleReadOnly: boolean = false;
  public isReadOnly: boolean = false;
  public isNonPOC: boolean = false;
  public jobgatewayComment = new JobGatewayComment();
  public defaultLatestDDPNew: Date;
  public defaultLatestDDPCurrent: Date;
  //#endregion

  //time
  public defaultTime = [];


  //#region constructor
  constructor(private router: Router, private route: ActivatedRoute, private actionService: ActionService,
    private snackBar: MatSnackBar, public dialog: MatDialog, private formBuilder: FormBuilder, private commonhelper: CommonHelper) {
    this.orderPassingModel = localStorage.getItem('OrderPassingModel') != null && localStorage.getItem('OrderPassingModel') != undefined
      ? JSON.parse(localStorage.getItem('OrderPassingModel').toString()) : new OrderPassingModel();
  }
  //#endregion

  //#region  on Init operation
  ngOnInit(): void {
    this.actionForm = this.formBuilder.group({
      selectedAction: [''],
      selectedSubAction: [''],
      scheduleDate: [''],
      reScheduleDate: [''],
      notes: [''],
      seletedCargo: [''],
      seletedStatus: [''],
      selectedException: [''],
      cargoQuantity: [''],
      addtionalComment: [''],
      name: [''],
      email: ['', [Validators.email]],
      phone: [''],
      contactMethod: '2268',
      latestTime: ['']
    });
    if (this.orderPassingModel.CustomerCode == 'Electrolux')
      this.isElectroluxCustomer = true;
    this.jobId = this.route.snapshot.paramMap.get('jobId');
    this.getContactMethods();
    if (this.jobId != null && this.jobId != undefined) {
      this.getActionByJobId(parseInt(this.jobId));
    }
    if (this.isElectroluxCustomer && this.isTemplateShow && this.isDropDownPanel) {
      if (!this.isRescheduleCancel)
        this.getCargoDetails();
      this.getInstallStatusDetails();
      this.getExceptionDetails();
    }
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.actionForm.controls[controlName].hasError(errorName);
  }
  //#endregion

  //#region Action/title operation
  getActionByJobId(jobId: number) {
    this.enableSpinner = true
    const success = (res) => {
      this.enableSpinner = false;
      if (res.Results.length === 0) {
        this.snackBar.open('No action are available', 'OK', { duration: 3000 });
        this.router.navigate(['/' + routeValues.orderdetails, { id: jobId }]);
        return;
      }
      this.enableSpinner = false;
      this.isTemplateShow = false;
      this.multipleActions = res.Results as JobAction[];
      this.subActionList = [];
      this.actionList = [...new Map(this.multipleActions.map(item => [item["GatewayCode"], item])).values()];
      this.filteredAction = this.actionForm.get('selectedAction').valueChanges
        .pipe(
          startWith(''),
          map(value => this.actionFilter(value))
        );
    }, fail = (err) => {
      this.snackBar.open('No records found', 'Close', { duration: 3000 });
      this.enableSpinner = false;
    };

    this.actionService.getActionByJobId(jobId, success, fail);
  }
  actionFilter(value: string): JobAction[] {
    if (value !== null && value !== undefined && value.toString().trim() !== '') {
      const filterValue = value.toString().toLowerCase();
      return this.actionList.filter(option => option.GatewayCode.toLowerCase().includes(filterValue));
    }
    return this.actionList;
  }
  onActionChange(gatewayCode: string) {
    if (this.actionText == 'Schedule' || this.actionText == '3PL Arrival') {
      this.isSchedule = true;
      this.actionForm.patchValue({
        scheduleDate: '',
        reScheduleDate: [''],
        seletedCargo: [''],
        seletedStatus: [''],
        selectedException: ['']
      });
      this.cargoText = '';
      this.exceptionText = '';
      this.statusText = '';
    } else {
      this.isSchedule = false;
    }
    if (this.actionText == 'Reschedule' || this.actionText == 'Delivery Window') {
      this.isSchedule = false;
    } else {
      this.isSchedule = true;
    }
    this.isTemplateShow = false;
    this.subActionList = this.multipleActions.filter(option =>
      option.GatewayCode.toLowerCase().includes(gatewayCode.toLowerCase()));
    this.filteredSubAction = this.actionForm.get('selectedSubAction').valueChanges
      .pipe(
        startWith(''),
        map(value => this.subActionFilter(value))
      );

    if (this.subActionList.length == 1) {
      this.isTemplateShow = true;
      this.subActionText = this.subActionList[0].PgdGatewayTitle;
      this.templateValueSet(this.subActionText);
    }
    else
      this.subActionText = '';
  }
  subActionFilter(value: string): JobAction[] {
    if (value !== null && value !== undefined && value.toString().trim() !== '') {
      const filterValue = value.toString().toLowerCase();
      return this.subActionList.filter(option => option.PgdGatewayTitle.toLowerCase().includes(filterValue));
    }
    return this.subActionList;
  }
  onSubActionChange(subGatewayCode: string) {
    this.cargoText = '';
    this.exceptionText = '';
    this.statusText = '';
    if (subGatewayCode == 'Product Damaged' || subGatewayCode == 'Product Overage' || subGatewayCode == 'Product Short')
      this.isNonPOC = true;
    this.templateValueSet(subGatewayCode);
  }
  //#endregion

  //#region template show hidden

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
  defaultTimeWithDate(d: Date, t: any) {
    return new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      t.getHours(),
      t.getMinutes(),
      t.getSeconds(),
      t.getMilliseconds()
    );
  }
  templateValueSet(code: string) {
    this.isTemplateShow = true;
    if (this.actionText == 'Contacted' || this.actionText == 'Left Message')
      this.isNonPOC = true;
    else
      this.isNonPOC = false;
    this.scheduleArrivalPlaceholder = this.getScheduleDatePlaceholder(this.actionText);
    this.exceptionReasonCodePlaceholder = this.actionText == 'Exception' ? 'Exception Reason' :
      ((this.actionText == 'Reschedule' || this.actionText == 'Canceled') ? 'Reason Code' : '');
    this.isDeliveryWindow = this.actionText == 'Delivery Window' ? true : false;
    this.isRescheduleCancel = (this.actionText == 'Reschedule' || this.actionText == 'Canceled') ? true : false;

    this.isDropDownPanel = this.isElectroluxCustomer &&
      (this.actionText == 'Reschedule' || this.actionText == 'Exception' || this.actionText == 'Canceled') ? true : false;
    const gwyStatusCode = this.subActionList.filter(option =>
      option.PgdGatewayTitle.toLowerCase().includes(code.toLowerCase()))[0].PgdGatewayCode;
    this.statusCode = this.splitValue(gwyStatusCode, 1);

    if (this.actionText == 'Reschedule') {
      this.isReadOnly = false;
      this.isScheduleReadOnly = true;
    } else if (this.actionText == 'Delivery Window') {
      this.isReadOnly = true;
    } else {
      this.isReadOnly = false;
      this.isScheduleReadOnly = false;
    }

    if (this.isElectroluxCustomer && this.isTemplateShow && this.isDropDownPanel) {
      if (!this.isRescheduleCancel)
        this.getCargoDetails();
      this.getInstallStatusDetails();
      this.getExceptionDetails();
    }
    this.getActionDetails();
  }
  splitValue(value, index) {
    if (value.indexOf('-') > -1)
      return value.substring(value.indexOf('-') + 1);
    return '';
  }
  //#endregion

  //#region Cargo/Install status/Esception drop down operation
  getCargoDetails() {
    const success = (res) => {
      this.cargoList = res.Results.length > 0 ? res.Results[0] as CargoModel[] : [];
      this.filteredCargo = this.actionForm.get('seletedCargo').valueChanges
        .pipe(
          startWith(''),
          map(value => this.cargoFilter(value))
        );

    }, fail = (err) => {
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    const postData = {
      'LangCode': 'EN',
      'ParentId': this.jobId,
      'TableFields': 'JobCargo.Id,JobCargo.CgoPartNumCode,JobCargo.CgoTitle,JobCargo.CgoSerialNumber',
      'PageSize': 10,
      'PageNumber': 1,
      'Entity': 'JobCargo'
    };
    this.actionService.getCargoDetails(postData, success, fail);
  }
  cargoFilter(value: string): CargoModel[] {
    if (value !== null && value !== undefined && value.toString().trim() !== '') {
      const filterValue = value.toString().toLowerCase();
      return this.cargoList.filter(option => option.CgoTitle.toLowerCase().includes(filterValue));
    }
    return this.cargoList;
  }
  getInstallStatusDetails() {
    const success = (res) => {
      this.installStatusList = res.Results[0] as InstallStatusModel[];
      this.filteredStatus = this.actionForm.get('seletedStatus').valueChanges
        .pipe(
          startWith(''),
          map(value => this.filterInstallStatus(value))
        );

    }, fail = (err) => {
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    const postData = {
      'LangCode': 'EN',
      'ParentId': this.orderPassingModel.CustomerId,
      'TableFields': 'GwyExceptionStatusCode.Id,GwyExceptionStatusCode.ExStatusDescription',
      'PageSize': 100,
      'PageNumber': 1,
      'Entity': 'GwyExceptionStatusCode',
      'ControlAction': this.subActionList.filter(x => x.PgdGatewayTitle.toLowerCase()
        .includes(this.subActionText.toLowerCase()))[0].GatewayCode,
    };
    this.actionService.getInstallStatusDetails(postData, success, fail);
  }
  filterInstallStatus(value: string): InstallStatusModel[] {
    if (value !== null && value !== undefined && value.toString().trim() !== '') {
      const filterValue = value.toString().toLowerCase();
      return this.installStatusList.filter(option => option.ExStatusDescription.toLowerCase().includes(filterValue));
    }
    return this.installStatusList;
  }
  getExceptionDetails() {
    const success = (res) => {
      this.exceptionList = res.Results[0] as ExceptionModel[];
      this.filteredException = this.actionForm.get('selectedException').valueChanges
        .pipe(
          startWith(''),
          map(value => this.filterException(value))
        );

    }, fail = (err) => {
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    const postData = {
      'LangCode': 'EN',
      'ParentId': this.jobId,
      'TableFields': 'GwyExceptionCode.Id,GwyExceptionCode.JgeTitle,GwyExceptionCode.JgeReasonCode',
      'PageSize': 100,
      'PageNumber': 1,
      'Entity': 'GwyExceptionCode',
      'ControlAction': this.subActionList.filter(x => x.PgdGatewayTitle.toLowerCase()
        .includes(this.subActionText.toLowerCase()))[0].PgdGatewayCode,
    };
    this.actionService.getInstallStatusDetails(postData, success, fail);
  }
  filterException(value: string): ExceptionModel[] {
    if (value !== null && value !== undefined && value.toString().trim() !== '') {
      const filterValue = value.toString().toLowerCase();
      return this.exceptionList.filter(option => option.JgeTitle.toLowerCase().includes(filterValue));
    }
    return this.exceptionList;
  }
  //#endregion

  //#region post Action Form
  cancelAction() {
    this.router.navigate(['/' + routeValues.orderdetails, { id: this.jobId }]);
  }
  addAction() {
    if (this.validation()) {
      this.jobgatewayComment.JobGatewayDescription = this.notesText;
      this.enableSpinner = true;
      const success = (res) => {
        this.enableSpinner = false;
        if (res.Results.length && res.Results[0].Id > 0 && this.notesText != null && this.notesText != '') {
          this.jobgatewayComment.JobGatewayId = res.Results[0].Id;
          this.insertComment(this.jobgatewayComment);
        }
        else {
          this.snackBar.open(this.subActionText + ' Successfully Added', 'CLOSE', { duration: 3000 });
          this.router.navigate(['/' + routeValues.orderdetails, { id: this.jobId }]);
        }
      }, fail = (err) => {
        this.enableSpinner = false;
        this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
      };
      const postData =
      {
        'JobID': this.jobId,
        'ProgramID': 0,
        'GwyGatewayCode': this.actionText,
        'GwyGatewayTitle': this.subActionText,
        'GwyGatewayDefault': true,
        'GatewayTypeId': 86,
        'GwyGatewayPCD': new Date(this.currentDate.getUTCDate()),
        'GwyGatewayECD': new Date(this.currentDate.getUTCDate()),
        'GwyGatewayACD': new Date(this.currentDate.getUTCDate()),
        'GwyCompleted': true,
        'GwyPerson': this.nameText,
        'GwyPhone': this.phoneText,
        'GwyEmail': this.emailText,
        'GwyPreferredMethod': this.actionModel.GwyPreferredMethod,
        'GwyTitle': this.subActionText,
        'GwyDDPCurrent': (this.actionText == '3PL Arrival' || this.actionText == 'Schedule') ? new Date(this.actionForm.value.scheduleDate ?? this.currentDate.getUTCDate()) : this.defaultLatestDDPCurrent,
        'GwyDDPNew': (this.actionText == 'Schedule') ? new Date(this.actionForm.value.scheduleDate ?? this.currentDate.getUTCDate()) : (this.actionText == 'Reschedule' ? new Date(this.actionForm.value.reScheduleDate ?? this.currentDate.getUTCDate()) : this.orderPassingModel.LatestDDPNew),
        'GwyUprWindow': 0,
        'GwyLwrWindow': 0,
        'GwyUprDate': this.actionModel.LatestTime,
        'GwyLwrDate': this.actionModel.EarliestTime,
        'CancelOrder': this.actionText == 'Canceled' ? true : false,
        'DateCancelled': (this.actionText == 'Canceled' && this.actionForm.value.scheduleDate != null) ? new Date(this.actionForm.value.scheduleDate ?? this.currentDate.getUTCDate()) : this.currentDate.getUTCDate(),
        'DateComment': (this.actionText == 'Comment' && this.actionForm.value.scheduleDate != null) ? new Date(this.actionForm.value.scheduleDate ?? this.currentDate.getUTCDate()) : this.currentDate.getUTCDate(),
        'DateEmail': (this.actionText == 'EMail' && this.actionForm.value.scheduleDate != null) ? new Date(this.actionForm.value.scheduleDate ?? this.currentDate.getUTCDate()) : this.currentDate.getUTCDate(),
        'StatusCode': this.statusCode,
        'isScheduled': this.actionText == 'Schedule' ? true : false,
        'isScheduleReschedule': (this.actionText == 'Schedule' || this.actionText == 'Reschedule') ? true : false,
        'Completed': true,
        'GwyCargoId': this.actionModel.GwyCargoId != null && this.actionModel.GwyCargoId != '' ? parseInt(this.actionModel.GwyCargoId) : null,
        'GwyExceptionTitleId': this.actionModel.GwyExceptionTitleId != null && this.actionModel.GwyExceptionTitleId != '' ? parseInt(this.actionModel.GwyExceptionTitleId) : null,
        'GwyExceptionStatusId': this.actionModel.GwyExceptionStatusId != null && this.actionModel.GwyExceptionStatusId != '' ? parseInt(this.actionModel.GwyExceptionStatusId) : null,
        'GwyAddtionalComment': this.actionForm.value.addtionalComment != null ? this.actionForm.value.addtionalComment : '',
        'CustomerId': this.orderPassingModel.CustomerId,
        'IsSpecificCustomer': this.isElectroluxCustomer,
        'IsMultiOperation': false,
        'CargoQuantity': this.actionForm.value.cargoQuantity !== null ? this.actionForm.value.cargoQuantity : 0,
        'IsCargoRequired': this.cargoList.length > 0 ? true : false,
        'CargoField': this.actionModel.CargoField,
        'StatusId': null,
        'DateEntered': new Date(this.currentDate.getUTCDate()),
        'DateChanged': new Date(this.currentDate.getUTCDate()),
        'EnteredBy': new Date(this.commonhelper.getUserName()),
        'Id': 0,
        'ContractNumber': this.actionModel.ContractNumber,
      };
      this.actionService.addAction(postData, success, fail);
    }
  }
  //#endregion

  timeConvertion(time) {
    var date = new Date(parseInt(time));
    var localeSpecificTime = date.toLocaleTimeString();
    return localeSpecificTime.replace(/:\d+ /, ' ');
  }
  //#region  Get Action Details
  getActionDetails() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      if (res.Results.length > 0) {
        const result = res.Results[0];
        this.actionModel = new ActionModel();
        this.actionModel.CargoField = result.CargoField;
        this.actionModel.DefaultTime = new Date(result.DefaultTime).getTime();
        this.actionModel.GwyPreferredMethod = result.GwyPreferredMethod;
        this.actionModel.GwyPerson = result.GwyPerson;
        this.actionModel.GwyPhone = result.GwyPhone;
        this.actionModel.GwyEmail = result.GwyEmail;
        this.actionModel.GwyLwrDate = result.GwyLwrDate;
        this.actionModel.GwyUprDate = result.GwyUprDate;
        this.actionModel.DelDay = result.DelDay;
        this.actionModel.ContractNumber = result.ContractNumber;
        this.orderPassingModel.LatestDDPNew = result.GwyDDPNew;
        this.orderPassingModel.LatestDDPCurrent = result.GwyDDPCurrent;
        if (this.actionModel.DefaultTime != null && this.actionModel.DefaultTime != undefined) {
          let result = new Date(this.actionModel.DefaultTime);
          this.defaultTime = [result.getHours(), result.getMinutes(), result.getSeconds()]
        }

        this.defaultLatestDDPNew = this.defaultTimeWithDate(new Date(this.orderPassingModel.LatestDDPNew), new Date(this.actionModel.DefaultTime));
        this.defaultLatestDDPCurrent = this.defaultTimeWithDate(new Date(this.orderPassingModel.LatestDDPCurrent), new Date(this.actionModel.DefaultTime));
        if (this.actionText == 'Delivery Window' && this.actionModel.DelDay && this.actionModel.GwyUprDate != null && this.actionModel.GwyUprDate != undefined && this.actionModel.GwyUprDate != '') {
          const latestInPutTime = new Date(res.Results[0].GwyUprDate).getTime();
          this.time = this.timeConvertion(latestInPutTime);
          this.actionModel.LatestTime = this.time;
          this.actionForm.patchValue({
            reScheduleDate: this.defaultLatestDDPNew
          });
        } else if (this.actionText == 'Reschedule') {
          this.actionForm.patchValue({
            scheduleDate: this.defaultLatestDDPNew,
            reScheduleDate: ['']
          });
        } else {
          this.actionForm.patchValue({
            scheduleDate: this.defaultTimeWithDate(new Date(this.currentDate), new Date(this.actionModel.DefaultTime))
          });
        }

        this.actionForm.patchValue({
          name: this.actionModel.GwyPerson,
          email: this.actionModel.GwyEmail,
          phone: this.actionModel.GwyPhone,
          contactMethod: this.actionModel.GwyPreferredMethod,
        });
      }
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };

    this.actionDetails.Id = 0
    this.actionDetails.JobId = parseInt(this.jobId);
    this.actionDetails.GatewayCode = this.subActionList.filter(x => x.PgdGatewayTitle.toLowerCase().includes(this.subActionText.toLowerCase()))[0].PgdGatewayCode;
    this.actionDetails.EntityFor = 'Action';
    this.actionDetails.Is3PlAction = this.actionText == '3PL Arrival' ? true : false;
    this.actionService.getActionDetails(this.actionDetails, success, fail);
  }
  //#endregion

  validation() {
    let isValidate = true;
    if (this.emailText != '' && this.emailText != null && this.emailText != undefined) {
      isValidate = this.commonhelper.isValidEmail(this.emailText)
      if (!isValidate) {
        this.snackBar.open('Invalid Email adress', 'CLOSE', { duration: 3000 });
        isValidate = false;
        return;
      }
    }
    if (this.phoneText != '' && this.phoneText != null && this.phoneText != undefined) {
      if (this.phoneText.match(/\d/g).length === 10) {
        isValidate = true;
      } else {
        this.snackBar.open('Please provide 10 digit phone number', 'CLOSE', { duration: 3000 });
        isValidate = false;
        return;
      }
    }
    if (this.actionText == 'Schedule' || this.actionText == '3PL Arrival') {
      if (this.actionForm.value.scheduleDate != null && this.actionForm.value.scheduleDate != undefined && this.actionForm.value.scheduleDate != '') {
        if (new Date(this.actionForm.value.scheduleDate) != null)
          isValidate = true;
        else {
          this.snackBar.open('Schedule date is invalid', 'CLOSE', { duration: 3000 });
          isValidate = false;
        }
      } else {
        this.snackBar.open('Schedule date is required', 'CLOSE', { duration: 3000 });
        isValidate = false;
      }
    } else if (this.actionText == 'Reschedule' || this.actionText == 'Exception' || this.actionText == 'Canceled') {
      if (this.actionText == 'Reschedule') {
        if (this.actionForm.value.reScheduleDate != null && this.actionForm.value.reScheduleDate != undefined && this.actionForm.value.reScheduleDate != '') {
          if (new Date(this.actionForm.value.reScheduleDate) != null) {
            isValidate = true;
          }
          else {
            this.snackBar.open('Reschedule date is invalid', 'CLOSE', { duration: 3000 });
            isValidate = false;
            return;
          }
        } else {
          this.snackBar.open('Reschedule date is required', 'CLOSE', { duration: 3000 });
          isValidate = false;
          return;
        }
      }
      if (this.isElectroluxCustomer) {
        const dynamicExceptionInvalidMsg = this.actionText == 'Exception' ? 'Exception code is Invalid' : 'Reasone code is Invalid';
        const dynamicExceptionrequireMsg = this.actionText == 'Exception' ? 'Exception code is require' : 'Reasone code is require';

        if (this.actionText == 'Exception') {
          if (this.cargoText != null && this.cargoText != undefined && this.cargoText != '') {
            var count = this.cargoList.length > 0 ? this.cargoList.filter(x => x.CgoTitle.toLowerCase() == this.cargoText.toLowerCase()).length : 0;
            let cargoId = count > 0 ? this.cargoList.filter(x => x.CgoTitle.toLowerCase() == this.cargoText.toLowerCase())[0].Id : 0;
            if (cargoId > 0) {
              this.actionModel.GwyCargoId = cargoId.toString();
              isValidate = true;
            }
            else {
              this.snackBar.open('Cargo is Invalid', 'CLOSE', { duration: 3000 });
              isValidate = false;
              return;
            }
          } else {
            this.snackBar.open('Cargo is reuired', 'CLOSE', { duration: 3000 });
            isValidate = false;
            return;
          }
        }
        if (this.statusText != null && this.statusText != undefined && this.statusText != '') {
          var count = this.installStatusList.length > 0 ? this.installStatusList.filter(x => x.ExStatusDescription.toLowerCase() == this.statusText.toLowerCase()).length : 0;
          let installStatusID = count > 0 ? this.installStatusList.filter(x => x.ExStatusDescription.toLowerCase() == this.statusText.toLowerCase())[0].Id : 0;
          if (installStatusID > 0) {
            this.actionModel.GwyExceptionStatusId = installStatusID.toString();
          }
          else {
            this.snackBar.open('Install status is Invalid', 'CLOSE', { duration: 3000 });
            isValidate = false;
            return;
          }
        } else {
          this.snackBar.open('Install status is reuired', 'CLOSE', { duration: 3000 });
          isValidate = false;
          return;
        }
        if (this.exceptionText != null && this.exceptionText != undefined && this.exceptionText != '') {
          var count = this.exceptionList.length > 0 ? this.exceptionList.filter(x => x.JgeTitle.toLowerCase() == this.exceptionText.toLowerCase()).length : 0;
          let exceptionId = count > 0 ? this.exceptionList.filter(x => x.JgeTitle.toLowerCase() == this.exceptionText.toLowerCase())[0].Id : 0;
          if (exceptionId > 0) {
            this.actionModel.GwyExceptionTitleId = exceptionId.toString();
            isValidate = true;
          }
          else {
            this.snackBar.open(dynamicExceptionInvalidMsg, 'CLOSE', { duration: 3000 });
            isValidate = false;
            return;
          }
        } else {
          this.snackBar.open(dynamicExceptionrequireMsg, 'CLOSE', { duration: 3000 });
          isValidate = false;
          return;
        }
      }
    } else if (this.actionText == 'Delivery Window') {
      if (this.actionModel.EarliestTime != null && this.actionModel.EarliestTime != undefined) {
        isValidate = true;
      } else {
        this.snackBar.open('Earliest time is required', 'CLOSE', { duration: 3000 });
        isValidate = false;
        return;
      }
      if (this.actionModel.LatestTime != null && this.actionModel.LatestTime != undefined) {
        isValidate = true;
      } else {
        this.snackBar.open('Latest time is required', 'CLOSE', { duration: 3000 });
        isValidate = false;
        return;
      }
      let t1 = this.parseTime(this.actionModel.EarliestTime);
      let t2 = this.parseTime(this.actionModel.LatestTime);
      let t = (t2.hh * 60 - t2.mm) - (t1.hh * 60 + t1.mm);
      if (t <= 0) {
        this.snackBar.open('Earliest time should be less than Latest time.', 'CLOSE', { duration: 3000 });
        isValidate = false;
        return;
      } else {
        if (t < 120) {
          this.snackBar.open('Earliest time should be minimum 2 hours less from Latest time.', 'CLOSE', { duration: 3000 });
          isValidate = false;
          return;
        } else {
          isValidate = true;
        }
      }
    }
    return isValidate;
  }
  setEarliestTime(event) {
    this.actionModel.EarliestTime = event;
  }
  setLatestTime(event) {
    this.actionModel.LatestTime = event;
  }
  getContactMethods() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      if (res.Results.length > 0) {
        const result = res.Results;
        this.contactMethods = result;
      }
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.actionService.getContactMethods(2030, success, fail);
  }
  onSelectContactMethod(event) {
    this.actionForm.patchValue({
      contactMethod: event.value,
    });
    this.actionModel.GwyPreferredMethod = event.value != 0 ? parseInt(event.value) : 0;
  }
  insertComment(jobgatewayComment: JobGatewayComment) {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.snackBar.open(this.subActionText + ' Successfully Added', 'CLOSE', { duration: 3000 });
      this.router.navigate(['/' + routeValues.orderdetails, { id: this.jobId }]);
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured while comment are updateing', 'CLOSE', { duration: 3000 });
    };
    this.actionService.insertComment(jobgatewayComment, success, fail);
  }
  parseTime(s) {
    var part = s.match(/(\d+):(\d+)(?: )?(am|pm)?/i);
    var hh = parseInt(part[1], 10);
    var mm = parseInt(part[2], 10);
    var ap = part[3] ? part[3].toUpperCase() : null;
    if (ap === "AM") {
      if (hh == 12) {
        hh = 0;
      }
    }
    if (ap === "PM") {
      if (hh != 12) {
        hh += 12;
      }
    }
    return { hh: hh, mm: mm };
  }
}
