import { Component, OnInit } from '@angular/core';
import { GatewayService } from '../gateway/gateway.service';
import { Router, ActivatedRoute } from '@angular/router';
import { routeValues } from 'src/app/utility/route-name';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonHelper } from 'src/app/utility/commonHelper';
import { GatewayDetails } from 'src/app/models/GatewayDetails';
import { OrderPassingModel } from 'src/app/models/OrderDetails';
import { JobGatewayComment } from 'src/app/models/JobGatewayComment';

@Component({
  selector: 'app-gateway',
  templateUrl: './gateway.component.html',
  styleUrls: ['./gateway.component.scss']
})
export class GatewayComponent implements OnInit {
  //#region Declaretion and initialization
  public jobId: string;
  public enableSpinner = false;
  public gatewayForm: FormGroup;
  public selectedGatewayText: string;
  public gatewayList: GatewayDetails[] = [];
  public isTemplateShow: boolean = false;
  public titleText: string;
  public codeText: string;
  public notesText: string;
  public currentDate: Date = new Date();
  public checked = true;
  public orderPassingModel: OrderPassingModel;
  public isElectroluxCustomer = false;  
  public jobgatewayComment = new JobGatewayComment();
  //#endregion

  //#region  constructor(inject) and oninit method
  constructor(private router: Router, private route: ActivatedRoute, private gatewayService: GatewayService, private snackBar: MatSnackBar,
    public dialog: MatDialog, private formBuilder: FormBuilder, private commonhelper: CommonHelper) {
    this.orderPassingModel = localStorage.getItem('OrderPassingModel') != null && localStorage.getItem('OrderPassingModel') != undefined
      ? JSON.parse(localStorage.getItem('OrderPassingModel').toString()) : new OrderPassingModel();
  }

  ngOnInit(): void {
    this.gatewayForm = this.formBuilder.group({
      selectedGateway: [''],
      title: [''],
      code: [''],
      notes: [''],
      completed: [''],
      acd: new Date(Date.now()).toLocaleString().split(',')[0]
    });

    this.jobId = this.route.snapshot.paramMap.get('jobId');
    if (this.orderPassingModel.CustomerCode == 'Electrolux')
      this.isElectroluxCustomer = true;
    this.getNextGateway();
  }
  //#endregion

  //#region methods

  getNextGateway() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      if (res.Results.length > 0) {
        const result = res.Results;
        this.gatewayList = result as GatewayDetails[];
      } else {
        this.snackBar.open('Next Gateway are not available', 'CLOSE', { duration: 3000 });
        this.cancelGateway();
      }
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.gatewayService.getNextGateway(this.jobId, success, fail);
  }
  onSelectNextGateway(event) {
    this.isTemplateShow = true;
    this.templateVisiblity(event.value);
  }
  templateVisiblity(code: string) {
    this.gatewayForm.patchValue({
      acd: new Date(Date.now()).toLocaleString().split(',')[0]
    });
    this.codeText = code;
    this.titleText = code;
  }
  cancelGateway() {
    this.router.navigate(['/' + routeValues.orderdetails, { id: this.jobId }]);
  }
  addGateway() {
    this.enableSpinner = true;    
    this.jobgatewayComment.JobGatewayDescription = this.notesText;
    let date = new Date(Date.now()).toLocaleString().split(',')[0];
    const success = (res) => {
      this.enableSpinner = false;
      if (res.Results.length && res.Results[0].Id > 0 && this.notesText != null && this.notesText != '') {
        this.jobgatewayComment.JobGatewayId = res.Results[0].Id;
        this.insertComment(this.jobgatewayComment);
      }
      else {
        this.snackBar.open(this.codeText + ' Successfully Added', 'CLOSE', { duration: 3000 });
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
      'GwyGatewayCode': this.codeText,
      'GwyGatewayTitle': this.titleText,
      'GwyGatewayDefault': true,
      'GatewayTypeId': 85,
      'GwyGatewayPCD': date,
      'GwyGatewayECD': date,
      'GwyGatewayACD': date,
      'Completed': true,
      'GwyCompleted': true,
      'CustomerId': this.orderPassingModel.CustomerId,
      'IsSpecificCustomer': this.isElectroluxCustomer,
      'StatusId': null,
      'DateEntered': date,
      'DateChanged': null,
      'EnteredBy': this.commonhelper.getUserName(),
      'Id': 0,
      'GwyOrderType': this.orderPassingModel.GwyOrderType,
      'GwyShipmentType':this.orderPassingModel.GwyShipmentType,
    };
    this.gatewayService.addGateway(postData, success, fail);
  }
  insertComment(jobgatewayComment: JobGatewayComment) {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.snackBar.open(this.codeText + ' Successfully Added', 'CLOSE', { duration: 3000 });
      this.router.navigate(['/' + routeValues.orderdetails, { id: this.jobId }]);
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured while comment are updateing', 'CLOSE', { duration: 3000 });
    };
    this.gatewayService.insertComment(jobgatewayComment, success, fail);
  }
  //#endregion
}
