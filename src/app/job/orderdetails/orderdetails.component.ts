import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OrderdetailsService } from './orderdetails.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderDetails, OrderGatewayDetails, OrderDocumentDetails, OrderPassingModel } from 'src/app/models/OrderDetails';
import { routeValues } from 'src/app/utility/route-name';
import { CommonHelper } from 'src/app/utility/commonHelper';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActionComponent } from '../action/action.component';
import { MatDialog } from '@angular/material/dialog';
import { FileuploadComponent } from '../fileupload/fileupload.component';
import { JobPermission, Permission } from 'src/app/models/JobPermission';
import { from } from 'rxjs';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { EntitiesAlias, PagedDataInfo } from 'src/app/models/JobCardRequest';
import { JobCargo } from 'src/app/models/JobCargo';
import { ActiveUser } from 'src/app/models/ActiveUser';
import { JobPrice } from 'src/app/models/JobPrice';
import { JobCost } from 'src/app/models/JobCost';
import { JobEDIxCBL } from 'src/app/models/JobEDIxCBL';
import { ActionModel } from 'src/app/models/ActionModel';
import { ActionDetails } from 'src/app/models/ActionDetails';
import { GatewaypopupComponent } from '../gatewaypopup/gatewaypopup.component';
import { GatewayDetails } from 'src/app/models/GatewayDetails';
import { UpdateDriverRequest } from 'src/app/models/UpdateDriverRequest';


@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderdetails.component.html',
  styleUrls: ['./orderdetails.component.scss']
})
export class OrderdetailsComponent implements OnInit {
  public enableSpinner = false;
  public id: string;
  public orderDetails: any;
  public orderGatewayDetails: any;
  public displayedColumns: string[] = ['GatewayCode', 'GatewayTitle', 'GateWayName', 'ACD', 'View']; // 'PCD',
  public displayedDocColumns: string[] = ['JdrTitle', 'DocTypeIdName', 'view']; //'JdrCode',
  public dataSource: any;
  public hasRecord: string = 'none';
  public hasDocRecord: string = 'none';
  public disPlayGreen: string = '#4285f4';
  public disPlayRed: string = 'rgb(216 212 212)';
  public isProduction = false;
  public isTransit = false;
  public isOnHand = false;
  public isOnTruck = false;
  public isPodUpload = false;
  public isCompleted = false;
  public isElectroluxCustomer = false;
  public inProductionACD: string;
  public inTransitACD: string;
  public onHandACD: string;
  public onTruckACD: string;
  public podUploadACD: string;
  public completedACD: string;
  public isM4PLUser = false;
  public docDataSource: any;
  public orderDocumentDetails: any;
  public orderPassingModel: OrderPassingModel;
  public orderGatewayGridDetails: any;
  public isJobPermission: boolean = false;
  public PermissionModel: JobPermission = new JobPermission();
  public permission: Permission;
  public isJobCard: boolean = true;
  public tabName: string = '';
  public pagedDataInfo = new PagedDataInfo();
  public cargoModels: JobCargo[];
  public priceModels: JobPrice[];
  public costModels: JobCost[];
  public pageNumber: number = 1;
  public pageSize: number = 5;
  public TotalCount: number = 0;
  public activeUserObj = new ActiveUser();
  public panelOpenState = false;
  public EDIxCBLModels: JobEDIxCBL[];
  public actionDetails = new ActionDetails;
  public driverAlert: string = '';
  public jobNotes: string = '';

  public displayedEDIXcblColumns: string[] = [
    //   'Id'
    // , 'StatusId'
    'EdtCode'
    , 'EdtTitle'
    , 'EdtData'
    , 'EdtTypeIdName'
    , 'TransactionDate'
  ]
  public displayedCostColumns: string[] =
    [
      // 'Id'
      'CstLineItem'
      , 'CstChargeID'
      , 'CstChargeCode'
      , 'CstTitle'
      , 'ChargeTypeIdName'
      , 'CstQuantity'
      , 'CstUnitIdName'
      , 'CstRate'
      , 'CstComments'
      // , 'StatusId'
      , 'CstElectronicBilling'
      , 'IsProblem'
    ];
  public displayedPriceColumns: string[] =
    [
      // 'Id'
      'PrcLineItem'
      , 'PrcChargeID'
      , 'PrcChargeCode'
      , 'PrcTitle'
      , 'ChargeTypeIdName'
      , 'PrcQuantity'
      , 'PrcUnitIdName'
      , 'PrcRate'
      , 'PrcComments'
      // , 'StatusId'
      , 'PrcElectronicBilling'
      , 'IsProblem'
    ];
  public displayedCargoColumns: string[] =
    [
      // 'Id'
      'CgoLineItem'
      , 'CgoPartNumCode'
      , 'CgoSerialNumber'
      , 'CgoTitle'
      // , 'StatusId'
      , 'CgoWeight'
      , 'CgoCubes'
      , 'CgoQtyExpected'
      , 'CgoQtyOnHand'
      , 'CgoQtyDamaged'
      , 'CgoQtyOnHold'
      , 'CgoQtyOrdered'
      , 'CgoQtyShortOver'
      , 'CgoQtyOver'
      , 'CgoLongitude'
      , 'CgoLatitude'
      , 'CgoMasterCartonLabel'
      , 'CgoPackagingTypeIdName'
      , 'CgoWeightUnitsIdName'
      , 'CgoVolumeUnitsIdName'
      , 'CgoQtyUnitsIdName'
      , 'CgoDateLastScan'
    ];

  public driverRequestModel = new UpdateDriverRequest();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute, private orderDetailsService: OrderdetailsService
    , private snackBar: MatSnackBar, private router: Router, private commonHelper: CommonHelper,
    public dialog: MatDialog) {
    this.activeUserObj = JSON.parse(localStorage.getItem("GetActiveUser")) as ActiveUser;
    this.orderPassingModel = new OrderPassingModel();
    this.isM4PLUser = this.commonHelper.getToken() != null && this.commonHelper.getToken() != undefined
      ? true : false;
    const data = this.orderGatewayGridDetails as Array<OrderGatewayDetails>;
    this.dataSource = new MatTableDataSource<OrderGatewayDetails>(data);
    const docData = this.orderDocumentDetails as Array<OrderDocumentDetails>;
    this.docDataSource = new MatTableDataSource<OrderDocumentDetails>(docData);

    this.PermissionModel.Job = Permission.ReadOnly;
    this.PermissionModel.Tracking = Permission.ReadOnly;
    this.PermissionModel.Document = Permission.ReadOnly;
  }
  getType(enumString: string): any {
    return Permission[enumString];
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isJobCard = JSON.parse(this.route.snapshot.paramMap.get('isJobGrid') == null ? 'false' : 'true');;
    this.getOrderDetailsById(parseInt(this.id));
  }
  ngAfterViewInit(): void {
    this.getGatewayOrderDetails(parseInt(this.id));
  }
  getOrderDetailsById(jobId: number) {
    this.enableSpinner = true
    const success = (res) => {
      this.enableSpinner = false;
      if (res.Results.length === 0) {
        this.hasRecord = 'none';
        this.snackBar.open('No records found', 'OK', { duration: 3000 });
        return;
      }
      this.enableSpinner = false;
      this.orderDetails = res.Results[0] as OrderDetails;
      this.driverAlert = this.orderDetails.JobDriverAlert;
      this.isJobPermission = this.orderDetails.IsJobPermission;
      this.orderPassingModel.CustomerCode = this.orderDetails.CustomerCode;
      this.orderPassingModel.CustomerId = this.orderDetails.CustomerId;
      this.orderPassingModel.GwyOrderType = this.orderDetails.GwyOrderType;
      this.orderPassingModel.GwyShipmentType = this.orderDetails.GwyShipmentType;

      let AddPermission = localStorage.getItem("UserSecurites");
      if (AddPermission != null && AddPermission != undefined) {
        this.PermissionModel = JSON.parse(AddPermission) as JobPermission;
      }
      if (this.orderDetails.CustomerCode == 'Electrolux')
        this.isElectroluxCustomer = true;

      this.orderGatewayDetails = this.orderDetails.OrderGatewayDetails as Array<OrderGatewayDetails>;

      localStorage.setItem('OrderPassingModel', JSON.stringify(this.orderPassingModel));
      this.hasRecord = 'block';
      this.orderGatewayDetails.forEach(element => {
        if (element.GatewayCode == 'In Production') {
          this.isProduction = true;
          this.inProductionACD = element.ACD;
        }
        else if (element.GatewayCode == 'In Transit') {
          this.isTransit = true;
          this.inTransitACD = element.ACD;
        }
        if (element.GatewayCode == 'On Truck') {
          this.isOnTruck = true;
          this.onTruckACD = element.ACD;
        }
        else if (element.GatewayCode == 'On Hand') {
          this.isOnHand = true;
          this.onHandACD = element.ACD;
        }
        if (element.GatewayCode == 'POD Upload') {
          this.isPodUpload = true;
          this.podUploadACD = element.ACD;
        }
        else if (element.GatewayCode == 'Completed') {
          this.isCompleted = true;
          this.completedACD = element.ACD;
        }
      });

    }, fail = (err) => {
      this.snackBar.open('No records found', 'Close', { duration: 3000 });
      this.enableSpinner = false;
    };
    this.orderDetailsService.getOrderDetailsById(jobId, success, fail);
  }
  getGatewayOrderDetails(jobId: number) {
    this.enableSpinner = true
    const success = (res) => {
      this.enableSpinner = false;
      if (res.Results.length === 0) {
        this.hasRecord = 'none';
        this.snackBar.open('No records found', 'OK', { duration: 3000 });
        return;
      }
      this.orderGatewayGridDetails = res.Results[0] as Array<OrderGatewayDetails>;
      const data = this.orderGatewayGridDetails as Array<OrderGatewayDetails>;
      this.dataSource = new MatTableDataSource<OrderGatewayDetails>(data);

      if (this.orderGatewayGridDetails.length > 0) {

      } else {
        this.snackBar.open('No document records are found', 'OK', { duration: 3000 });
      }

    }, fail = (err) => {
      this.snackBar.open('No records found', 'Close', { duration: 3000 });
      this.enableSpinner = false;
    };
    this.orderDetailsService.getGatewayDetailsById(jobId, success, fail);
  }
  redirectToTracking() {
    let searchResult = localStorage.getItem("search");
    if (searchResult != null && searchResult != undefined && searchResult != '')
      this.router.navigate(['/' + routeValues.tracking, { search: searchResult }]);
    else
      this.router.navigate(['/' + routeValues.tracking]);
  }
  addAction() {
    this.router.navigate(['/' + routeValues.action, { jobId: this.id }]);
  }
  addGateway() {
    this.router.navigate(['/' + routeValues.gateway, { jobId: this.id }]);
  }
  getJobDocumentDetails(jobId: number) {
    this.enableSpinner = true
    const success = (res) => {
      this.enableSpinner = false;

      if (res.Results.length == 0) {
        this.hasDocRecord = 'none';
      }
      if (res.Results.length == 1 && res.Results[0].length == 0) {
        this.hasDocRecord = 'none';
      } else {
        this.hasDocRecord = 'block';
        const docData = this.orderDocumentDetails = res.Results[0] as Array<OrderDocumentDetails>;
        this.docDataSource = new MatTableDataSource<OrderDocumentDetails>(docData);
      }
    }, fail = (err) => {
      this.snackBar.open('No records found', 'Close', { duration: 3000 });
      this.enableSpinner = false;
    };
    this.orderDetailsService.getJobDocumentDetailsById(jobId, success, fail);
  }
  downLoad(documentId: number, docCode: string) {
    this.enableSpinner = true
    const success = (res) => {
      this.enableSpinner = false;
      if (res.Results[0].length === 0) {
        this.snackBar.open('No records found', 'OK', { duration: 3000 });
        return;
      }
      var file = this.base64ToArrayBuffer(res.Results[0].AttData);
      // let mimeType = 'application/' + res.Results[0].AttFileName.split('.').pop() + "'";
      this.saveByteArray(res.Results[0].AttFileName, file);
    }, fail = (err) => {
      this.snackBar.open('No records found', 'Close', { duration: 3000 });
      this.enableSpinner = false;
    };
    this.orderDetailsService.getDownloadDocumentByJobId(documentId, success, fail);
  }
  saveByteArray(reportName, byte) {
    let blob = new Blob([byte], { type: 'application/javascript' });
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    let fileName = reportName;
    link.download = fileName;
    link.click();
  };
  base64ToArrayBuffer(base64) {
    let binaryString = window.atob(base64);
    let binaryLen = binaryString.length;
    let bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      let ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }
  fileUpload() {
    this.router.navigate(['/' + routeValues.fileupload, { id: this.id }]);
  }
  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.tabName = tabChangeEvent.tab["textLabel"];
    if (this.tabName == 'Tracking')
      this.getGatewayOrderDetails(parseInt(this.id));
    else if (this.tabName == 'Cargo')
      this.PagedDataCargoDetails();
    else if (this.tabName == 'Price')
      this.PagedDataPriceDetails();
    else if (this.tabName == 'Cost')
      this.PagedDataCostDetails();
    else if (this.tabName == 'Document')
      this.getJobDocumentDetails(parseInt(this.id));
    else if (this.tabName == 'EDI/xCBL')
      this.PagedDataXCBLDetails();
    else if (this.tabName == 'Notes')
      this.GetJobNotes(parseInt(this.id));
  }
  GetJobNotes(jobId: number) {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.jobNotes = res.Results[0];
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.orderDetailsService.jobNotes(jobId, success, fail);

  }
  PagedDataCargoDetails() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.cargoModels = res.Results as JobCargo[];
      this.TotalCount = res.TotalResults;
      this.dataSource = new MatTableDataSource<JobCargo>(this.cargoModels);
      this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    if (this.activeUserObj == null)
      this.activeUserObj = JSON.parse(localStorage.getItem("GetActiveUser")) as ActiveUser;
    if (this.activeUserObj != null && this.activeUserObj.IsSysAdmin != null && !this.activeUserObj.IsSysAdmin) {
      var index = this.displayedCargoColumns.indexOf("Id");
      if (index !== -1) {
        this.displayedCargoColumns.splice(index, 1);
      }
    }
    this.pagedDataInfo.UserId = this.activeUserObj.UserId;
    this.pagedDataInfo.OrganizationId = this.activeUserObj.OrganizationId;
    this.pagedDataInfo.RoleId = this.activeUserObj.RoleId;
    this.pagedDataInfo.PageNumber = this.pageNumber;
    this.pagedDataInfo.PageSize = this.pageSize;
    this.pagedDataInfo.IsNext = false;
    this.pagedDataInfo.IsEnd = false;
    this.pagedDataInfo.Entity = EntitiesAlias.JobCargo;
    this.pagedDataInfo.ParentId = parseInt(this.id);
    this.orderDetailsService.cargoDetails(this.pagedDataInfo, success, fail);
  }
  PageCargoEvents(event: PageEvent) {
    this.pageSize = +event.pageSize;
    this.pageNumber = +event.pageIndex + 1;
    this.PagedDataCargoDetails();
  }
  PagedDataPriceDetails() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.priceModels = res.Results as JobPrice[];
      this.TotalCount = res.TotalResults;
      this.dataSource = new MatTableDataSource<JobPrice>(this.priceModels);
      this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    if (this.activeUserObj == null)
      this.activeUserObj = JSON.parse(localStorage.getItem("GetActiveUser")) as ActiveUser;
    if (this.activeUserObj != null && this.activeUserObj.IsSysAdmin != null && !this.activeUserObj.IsSysAdmin) {
      var index = this.displayedPriceColumns.indexOf("Id");
      if (index !== -1) {
        this.displayedPriceColumns.splice(index, 1);
      }
    }
    this.pagedDataInfo.UserId = this.activeUserObj.UserId;
    this.pagedDataInfo.OrganizationId = this.activeUserObj.OrganizationId;
    this.pagedDataInfo.RoleId = this.activeUserObj.RoleId;
    this.pagedDataInfo.PageNumber = this.pageNumber;
    this.pagedDataInfo.PageSize = this.pageSize;
    this.pagedDataInfo.IsNext = false;
    this.pagedDataInfo.IsEnd = false;
    this.pagedDataInfo.Entity = EntitiesAlias.JobBillableSheet;
    this.pagedDataInfo.ParentId = parseInt(this.id);
    this.orderDetailsService.priceDetails(this.pagedDataInfo, success, fail);
  }
  PagePriceEvents(event: PageEvent) {
    this.pageSize = +event.pageSize;
    this.pageNumber = +event.pageIndex + 1;
    this.PagedDataPriceDetails();
  }
  PagedDataCostDetails() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.costModels = res.Results as JobCost[];
      this.TotalCount = res.TotalResults;
      this.dataSource = new MatTableDataSource<JobCost>(this.costModels);
      this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    if (this.activeUserObj == null)
      this.activeUserObj = JSON.parse(localStorage.getItem("GetActiveUser")) as ActiveUser;
    if (this.activeUserObj != null && this.activeUserObj.IsSysAdmin != null && !this.activeUserObj.IsSysAdmin) {
      var index = this.displayedEDIXcblColumns.indexOf("Id");
      if (index !== -1) {
        this.displayedEDIXcblColumns.splice(index, 1);
      }
    }
    this.pagedDataInfo.UserId = this.activeUserObj.UserId;
    this.pagedDataInfo.OrganizationId = this.activeUserObj.OrganizationId;
    this.pagedDataInfo.RoleId = this.activeUserObj.RoleId;
    this.pagedDataInfo.PageNumber = this.pageNumber;
    this.pagedDataInfo.PageSize = this.pageSize;
    this.pagedDataInfo.IsNext = false;
    this.pagedDataInfo.IsEnd = false;
    this.pagedDataInfo.Entity = EntitiesAlias.JobCostSheet;
    this.pagedDataInfo.ParentId = parseInt(this.id);
    this.orderDetailsService.costDetails(this.pagedDataInfo, success, fail);
  }
  PageCostEvents(event: PageEvent) {
    this.pageSize = +event.pageSize;
    this.pageNumber = +event.pageIndex + 1;
    this.PagedDataCostDetails();
  }
  PagedDataXCBLDetails() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.EDIxCBLModels = res.Results as JobEDIxCBL[];
      this.TotalCount = res.TotalResults;
      this.dataSource = new MatTableDataSource<JobEDIxCBL>(this.EDIxCBLModels);
      this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    if (this.activeUserObj == null)
      this.activeUserObj = JSON.parse(localStorage.getItem("GetActiveUser")) as ActiveUser;
    if (this.activeUserObj != null && this.activeUserObj.IsSysAdmin != null && !this.activeUserObj.IsSysAdmin) {
      var index = this.displayedCostColumns.indexOf("Id");
      if (index !== -1) {
        this.displayedCostColumns.splice(index, 1);
      }
    }
    this.pagedDataInfo.UserId = this.activeUserObj.UserId;
    this.pagedDataInfo.OrganizationId = this.activeUserObj.OrganizationId;
    this.pagedDataInfo.RoleId = this.activeUserObj.RoleId;
    this.pagedDataInfo.PageNumber = this.pageNumber;
    this.pagedDataInfo.PageSize = this.pageSize;
    this.pagedDataInfo.IsNext = false;
    this.pagedDataInfo.IsEnd = false;
    this.pagedDataInfo.Entity = EntitiesAlias.JobEDIXcbl;
    this.pagedDataInfo.ParentId = parseInt(this.id);
    this.orderDetailsService.XCBLDetails(this.pagedDataInfo, success, fail);
  }
  PageXCBLEvents(event: PageEvent) {
    this.pageSize = +event.pageSize;
    this.pageNumber = +event.pageIndex + 1;
    this.PagedDataXCBLDetails();
  }
  EditGateway(Id: number) {
    this.enableSpinner = true
    const success = (res) => {
      this.enableSpinner = false;
      let result = res.Results[0]
      let response = null;
      if (res.Results[0]["GatewayTypeId"] == 86) {
        response = result as ActionModel;
      } else if (res.Results[0]["GatewayTypeId"] == 85) {
        response = result as GatewayDetails;
      }

      localStorage.removeItem("GatewayResponse");
      localStorage.setItem("GatewayResponse", JSON.stringify(response));
      this.dialog.closeAll();
      const dialogRef = this.dialog.open(GatewaypopupComponent, {
        width: '800px', height: '400px', disableClose: true,
      });
      dialogRef.afterClosed().subscribe(message => {
        this.router.navigate(['/' + routeValues.orderdetails]);
      });
    }, fail = (err) => {
      this.snackBar.open('No records found', 'Close', { duration: 3000 });
      this.enableSpinner = false;
    };
    this.actionDetails.Id = Id
    this.actionDetails.JobId = parseInt(this.id);
    this.actionDetails.GatewayCode = '';
    this.actionDetails.EntityFor = 'Action';
    this.actionDetails.Is3PlAction = false;
    this.orderDetailsService.editGateway(this.actionDetails, success, fail);
  }
  driverAlertUpdate() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.driverRequestModel.jobId = parseInt(this.id);
    this.driverRequestModel.jobDriverAlert = this.driverAlert;
    this.orderDetailsService.updateDriverAlert(this.driverRequestModel, success, fail);
  }
}
