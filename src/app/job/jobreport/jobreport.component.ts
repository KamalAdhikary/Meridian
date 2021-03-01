import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ActiveUser } from 'src/app/models/ActiveUser';
import { Customer } from 'src/app/models/JobCard';
import { JobReportService } from './jobreport.service';
import { JobAdvanceReportFilter } from 'src/app/models/JobAdvanceReportFilter';
import { SysOption } from 'src/app/models/SysOption';
import { Job } from 'src/app/models/Job';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { EntitiesAlias, PagedDataInfo } from 'src/app/models/JobCardRequest';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { routeValues } from 'src/app/utility/route-name';
import { JobAdvanceReportRequest } from 'src/app/models/JobAdvanceReportRequest';
import { JobPermission, Permission } from 'src/app/models/JobPermission';
import { strings } from '@material/tabs/tab/constants';

@Component({
  selector: 'app-jobreport',
  templateUrl: './jobreport.component.html',
  styleUrls: ['./jobreport.component.scss']
})
export class JobreportComponent implements OnInit {
  public TotalCount: number = 0;
  public activeUserObj = new ActiveUser();
  public customerList: Customer[] = [];
  public selectedCustomers = [];
  public selectedCustomerId: number;
  public selectedPrograms = [];
  public selectedOrigins = [];
  public selectedDestinations = [];
  public selectedBrands = [];
  public selectedGatewayStatuses = [];
  public selectedServiceModes = [];
  public selectedProductTypes = [];
  public selectedScheduleds: JobAdvanceReportFilter;
  public selectedOrderTypes: JobAdvanceReportFilter;
  public selectedJobChannels = [];
  public selectedJobStatusIdNames: JobAdvanceReportFilter;
  public selectedDateTypeNames: JobAdvanceReportFilter;
  public selectedPackagingCodes: JobAdvanceReportFilter;
  public selectedCargoTitles: any;
  public selectedReportTypes = [];
  public programs: JobAdvanceReportFilter[] = [];
  public programList: JobAdvanceReportFilter[] = [];
  public origins: JobAdvanceReportFilter[] = [];
  public originList: JobAdvanceReportFilter[] = [];
  public destinations: JobAdvanceReportFilter[] = [];
  public destinationList: JobAdvanceReportFilter[] = [];
  public brands: JobAdvanceReportFilter[] = [];
  public brandList: JobAdvanceReportFilter[] = [];
  public gatewayStatuses: JobAdvanceReportFilter[] = [];
  public gatewayStatusList: JobAdvanceReportFilter[] = [];
  public serviceModes: JobAdvanceReportFilter[] = [];
  public serviceModeList: JobAdvanceReportFilter[] = [];
  public productTypes: JobAdvanceReportFilter[] = [];
  public productTypeList: JobAdvanceReportFilter[] = [];
  public scheduledNameList: JobAdvanceReportFilter[] = [];
  public orderTypeList: JobAdvanceReportFilter[] = [];
  public jobChannels: JobAdvanceReportFilter[] = [];
  public jobChannelList: JobAdvanceReportFilter[] = [];
  public JobStatusIdNameList: JobAdvanceReportFilter[] = [];
  public DateTypeNameList: JobAdvanceReportFilter[] = [];
  public startDate: any;
  public endDate: any;
  public searchText: any;
  public packagingCodes: JobAdvanceReportFilter[] = [];
  public packagingCodeList: JobAdvanceReportFilter[] = [];
  public cargoTitles: JobAdvanceReportFilter[] = [];
  public cargoTitleList: JobAdvanceReportFilter[] = [];
  public reportTypeList: SysOption[];
  public isJobAdvanceReport: boolean = false;
  public isManifestReport: boolean = false;
  public enableSpinner: boolean = false;
  public isPriceReport: boolean = false;
  public isCostReport: boolean = false;
  public pagedDataInfo = new PagedDataInfo();
  public jobModels: Job[];
  public pageNumber: number = 1;
  public pageSize: number = 10;
  public dataSource: any;
  public jobAdvanceReportRequest = new JobAdvanceReportRequest();
  public whereCondition: string = '';
  public PermissionModel: JobPermission = new JobPermission();
  public reportColumns: string[] = [];
  public isExport: boolean = false;
  public reportName: string = '';
  public isOSDReport: boolean = false;
  public osdReportColumns: string[] =
    [
      'Id'
      , 'JobCustomerSalesOrder'
      , 'CgoPartCode'
      , 'CgoSerialNumber'
      , 'ExceptionType'
      , 'JobManifestNo'
      , 'JobSiteCode'
    ];
  public specialReportColumns: string[] =
    [
      'JobDeliveryDateTimePlanned'
      , 'Id'
      , 'JobOriginDateTimePlanned'
      , 'JobGatewayStatus'
      , 'JobSiteCode'
      , 'JobCustomerSalesOrder'
      , 'PlantIDCode'
      , 'JobQtyActual'
      , 'JobPartsActual'
      , 'JobTotalCubes'
      // , 'RateChargeCode',
      // , 'RateTitle',
      // , 'RateAmount',
      , 'JobServiceMode'
      , 'JobCustomerPurchaseOrder'
      , 'JobCarrierContract'
      , 'StatusId'
      , 'JobDeliverySitePOC'
      , 'JobDeliverySitePOCPhone'
      , 'JobDeliverySitePOCPhone2'
      , 'JobDeliverySitePOCEmail'
      , 'JobOriginSiteName'
      , 'JobDeliverySiteName'
      , 'JobDeliveryStreetAddress'
      , 'JobDeliveryStreetAddress2'
      , 'JobDeliveryCity'
      , 'JobDeliveryState'
      , 'JobDeliveryPostalCode'
      , 'JobDeliveryDateTimeActual'
      , 'JobOriginDateTimeActual'
      , 'JobOrderedDate'
    ];
  public globalColumns: string[] =
    [
      'Id'
      , 'JobCustomerSalesOrder'
      , 'JobSiteCode'
      , 'JobCustomerPurchaseOrder'
      , 'JobCarrierContract'
      , 'JobGatewayStatus'
      , 'StatusId'
      , 'JobDeliverySitePOC'
      , 'JobDeliverySitePOCPhone'
      , 'JobDeliverySitePOCEmail'
      , 'JobDeliverySiteName'
      , 'JobDeliveryStreetAddress'
      , 'JobDeliveryStreetAddress2'
      , 'JobDeliveryCity'
      , 'JobDeliveryState'
      , 'JobDeliveryPostalCode'
      , 'JobDeliveryDateTimePlanned'
      , 'JobDeliveryDateTimeActual'
      , 'JobOriginDateTimePlanned'
      , 'JobOriginDateTimeActual'
      , 'JobSellerSiteName'
      , 'JobDeliverySitePOCPhone2'
      , 'PlantIDCode'
      , 'JobQtyActual'
      , 'JobPartsActual'
      , 'JobTotalCubes'
      , 'JobServiceMode'
      , 'JobOrderedDate'
      , 'JobIsSchedule'
      , 'PackagingCode'
      , 'CgoPartCode'
      , 'JobTotalWeight'
      , 'CargoTitle'
      , 'JobServiceActual'
      , 'JobMileage'
      , 'JobBOL'
    ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private jobReportService: JobReportService, private snackBar: MatSnackBar, private router: Router) {
    this.activeUserObj = JSON.parse(localStorage.getItem("GetActiveUser")) as ActiveUser;
    this.dataSource = new MatTableDataSource<Job>(null);
  }

  ngOnInit(): void {
    this.getReportTypes();
    this.getCustomerDetails();
    this.getProgramDetails();
    this.getOriginDetails();
    this.getDestinationDetails();
    this.getBrandDetails();
    this.getGatewayStatusDetails();
    this.getServiceModeDetails();
    this.getProductTypeDetails();
    this.getScheduledDetails();
    this.getOrderTypeDetails();
    this.getJobChannelDetails();
    this.getJobStatusIdNameDetails();
    this.getDateTypeNameDetails();
    this.getPackagingCodeDetails();
    this.getCargoTitleDetails();
  }

  getCustomerDetails() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.customerList = res.Results[0] as Customer[];
      this.customerList = this.customerList.filter(x => x.CustOrgId == 1);
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    if (this.activeUserObj == null)
      this.activeUserObj = JSON.parse(localStorage.getItem("GetActiveUser")) as ActiveUser;
    const postData = {
      'LangCode': 'EN',
      'OrganizationId': this.activeUserObj?.OrganizationId,
      'UserId': this.activeUserObj?.UserId,
      'RoleId': this.activeUserObj?.RoleId,
      'ParentId': 0,
      'TableFields': 'Customer.Id, Customer.CustCode, Customer.CustTitle,Customer.CustOrgId ',
      'PageSize': 100,
      'PageNumber': 1,
      'Entity': 'Customer',
    };
    this.jobReportService.getCustomerDetails(postData, success, fail);
  }
  getCustomer(event) {
    if (event != null && event != undefined && event.Id > 0) {
      this.selectedCustomerId = parseInt(event["Id"]);
      this.programList = this.programs.filter(x => x.CustomerId == this.selectedCustomerId);
      this.originList = this.origins.filter(x => x.CustomerId == this.selectedCustomerId);
      this.destinationList = this.destinations.filter(x => x.CustomerId == this.selectedCustomerId);
      this.brandList = this.brands.filter(x => x.CustomerId == this.selectedCustomerId);
      this.serviceModeList = this.gatewayStatuses.filter(x => x.CustomerId == this.selectedCustomerId);
      this.serviceModes = this.serviceModes.filter(x => x.CustomerId == this.selectedCustomerId);
      this.productTypeList = this.productTypes.filter(x => x.CustomerId == this.selectedCustomerId);
      this.jobChannelList = this.jobChannels.filter(x => x.CustomerId == this.selectedCustomerId);
      this.packagingCodeList = this.packagingCodes.filter(x => x.CustomerId == this.selectedCustomerId);
      this.cargoTitleList = this.cargoTitles.filter(x => x.CustomerId == this.selectedCustomerId);
    }
    else {
      this.selectedCustomerId = 0;
      this.programList = this.programs;
      this.originList = this.origins;
      this.destinationList = this.destinations;
      this.brandList = this.brands;
      this.gatewayStatusList = this.gatewayStatuses;
      this.serviceModeList = this.serviceModes;
      this.productTypeList = this.productTypes;
      this.jobChannelList = this.jobChannels;
      this.packagingCodeList = this.packagingCodes;
      this.cargoTitleList = this.cargoTitles;
    }
  }
  getProgramDetails() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.programs = this.programList = res.Results[0] as JobAdvanceReportFilter[];
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.jobReportService.getEntityDetailsByEntity("Program", success, fail);
  }
  getOriginDetails() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.origins = this.originList = res.Results[0] as JobAdvanceReportFilter[];
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.jobReportService.getEntityDetailsByEntity("Origin", success, fail);
  }
  getDestinationDetails() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.destinations = this.destinationList = res.Results[0] as JobAdvanceReportFilter[];
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.jobReportService.getEntityDetailsByEntity("Destination", success, fail);
  }
  getBrandDetails() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.brands = this.brandList = res.Results[0] as JobAdvanceReportFilter[];
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.jobReportService.getEntityDetailsByEntity("Brand", success, fail);
  }
  getGatewayStatusDetails() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.gatewayStatuses = this.gatewayStatusList = res.Results[0] as JobAdvanceReportFilter[];
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.jobReportService.getEntityDetailsByEntity("GatewayStatus", success, fail);
  }
  getScheduledDetails() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.scheduledNameList = res.Results[0] as JobAdvanceReportFilter[];
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.jobReportService.getEntityDetailsByEntity("Scheduled", success, fail);
  }
  getServiceModeDetails() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.serviceModes = this.serviceModeList = res.Results[0] as JobAdvanceReportFilter[];
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.jobReportService.getEntityDetailsByEntity("ServiceMode", success, fail);
  }
  getProductTypeDetails() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.productTypes = this.productTypeList = res.Results[0] as JobAdvanceReportFilter[];
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.jobReportService.getEntityDetailsByEntity("ProductType", success, fail);
  }
  getOrderTypeDetails() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.orderTypeList = res.Results[0] as JobAdvanceReportFilter[];
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.jobReportService.getEntityDetailsByEntity("OrderType", success, fail);
  }
  getJobChannelDetails() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.jobChannels = this.jobChannelList = res.Results[0] as JobAdvanceReportFilter[];
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.jobReportService.getEntityDetailsByEntity("JobChannel", success, fail);
  }
  getJobStatusIdNameDetails() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.JobStatusIdNameList = res.Results[0] as JobAdvanceReportFilter[];
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.jobReportService.getEntityDetailsByEntity("JobStatus", success, fail);
  }
  getDateTypeNameDetails() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.DateTypeNameList = res.Results[0] as JobAdvanceReportFilter[];
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.jobReportService.getEntityDetailsByEntity("DateType", success, fail);
  }
  getPackagingCodeDetails() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.packagingCodes = this.packagingCodeList = res.Results[0] as JobAdvanceReportFilter[];
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.jobReportService.getEntityDetailsByEntity("PackagingCode", success, fail);
  }
  getCargoTitleDetails() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.cargoTitles = this.cargoTitleList = res.Results[0] as JobAdvanceReportFilter[];
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.jobReportService.getEntityDetailsByEntity("CargoTitle", success, fail);
  }
  getType(enumString: string): any {
    return Permission[enumString];
  }
  getReportTypes() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.reportTypeList = res.Results;
      this.reportTypeList = this.reportTypeList.filter(x => x.SysRefName == "Job Advance Report" || x.SysRefName == "Manifest Report" || x.SysRefName == "Cost Charge" || x.SysRefName == "Price Charge" || x.SysRefName == "OSD Report");
      let AddPermission = localStorage.getItem("UserSecurites");
      if (AddPermission != null && AddPermission != undefined) {
        this.PermissionModel = JSON.parse(AddPermission) as JobPermission;
        if (this.PermissionModel.Cost < this.getType('ReadOnly')) {
          this.reportTypeList = this.reportTypeList.filter(x => x.SysRefName !== "Cost Charge");
        }
        if (this.PermissionModel.Price < this.getType('ReadOnly')) {
          this.reportTypeList = this.reportTypeList.filter(x => x.SysRefName !== "Price Charge");
        }
      }
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.jobReportService.getReportTypes(3032, success, fail);
  }

  removeColumns(columns: string[], arrColumnList: string[]) {
    columns.forEach(element => {
      let index = arrColumnList.indexOf(element);
      if (index !== -1) {
        arrColumnList.splice(index, 1);
      }
    });
  }
  getReport(event) {
    this.whereCondition = '';
    if (this.activeUserObj == null)
      this.activeUserObj = JSON.parse(localStorage.getItem("GetActiveUser")) as ActiveUser;
    if (event != null && event != undefined) {
      this.reportColumns = [];
      this.globalColumns.forEach((v, i) => {
        this.reportColumns.push(this.globalColumns[i]);
      });;
      this.jobAdvanceReportRequest.ReportType = event.SysRefId;
      this.reportName = event.SysRefName;
      if (this.activeUserObj != null && this.activeUserObj.IsSysAdmin != null && !this.activeUserObj.IsSysAdmin) {
        this.removeColumns(["Id"], this.reportColumns);
        this.removeColumns(["Id"], this.specialReportColumns);
      }
      if (event.SysRefName == "Job Advance Report") {
        this.isJobAdvanceReport = true;
        this.removeColumns(['JobPartsActual', 'JobQtyActual', 'CargoTitle', 'PackagingCode', 'CgoPartCode'], this.reportColumns);
      }
      else
        this.isJobAdvanceReport = false
      if (event.SysRefName == "Manifest Report")
        this.isManifestReport = true;
      else
        this.isManifestReport = false;
      if (event.SysRefName == "Cost Charge") {
        this.isCostReport = true;
        this.whereCondition = null;
      }
      else
        this.isCostReport = false;
      if (event.SysRefName == "Price Charge") {
        this.isPriceReport = true;
        this.whereCondition = null;
      }
      else
        this.isPriceReport = false;
      if (event.SysRefName == "OSD Report")
        this.isOSDReport = true;
      else
        this.isOSDReport = false;
    }
  }
  searchFilter() {
    this.pageSize = 20;
    this.pageNumber = 1;
    // this.TotalCount = 0;
    this.pagedDataInfo.WhereCondition = '';
    this.whereCondition = '';
    this.getPagetDataInfo();
  }
  PageEvents(event: PageEvent) {
    this.pageSize = +event.pageSize;
    this.pageNumber = +event.pageIndex + 1;
    this.getPagetDataInfo();
  }
  getPagetDataInfo(isDownload: boolean = false) {
    this.isExport = isDownload;
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.jobModels = res?.Results as Job[];
      if (this.isExport) {
        this.downloadCSV(this.jobModels);
      } else {
        this.TotalCount = res.TotalResults;
        this.dataSource = new MatTableDataSource<Job>(this.jobModels);
        this.dataSource.sort = this.sort;
      }
      // this.dataSource.paginator = this.paginator;
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.pagedDataInfo.UserId = this.activeUserObj.UserId;
    this.pagedDataInfo.OrganizationId = this.activeUserObj.OrganizationId;
    this.pagedDataInfo.RoleId = this.activeUserObj.RoleId;
    this.pagedDataInfo.PageNumber = isDownload ? 1 : this.pageNumber;
    this.pagedDataInfo.PageSize = isDownload ? this.TotalCount : this.pageSize;
    this.pagedDataInfo.IsNext = false;
    this.pagedDataInfo.IsEnd = false;
    this.pagedDataInfo.Entity = EntitiesAlias.JobAdvanceReport;
    if ((this.reportName === 'Price Charge') || (this.reportName === 'Cost Charge')) {
      console.log("Where condition not required");
    } else {
      this.GetJobAdvanceReportRequest();
      this.GetWhereCondition();
      this.pagedDataInfo.WhereCondition = this.whereCondition;
    }
    this.pagedDataInfo.Params = JSON.stringify(this.jobAdvanceReportRequest);
    this.jobReportService.PagedData(this.pagedDataInfo, success, fail);
  }
  GetWhereCondition() {
    if (this.selectedCustomerId != null && this.selectedCustomerId != undefined && this.selectedCustomerId > 0)
      this.whereCondition += " AND prg.PrgCustID = " + this.selectedCustomerId + " ";
    // else {
    //   if (this.whereCondition != null && this.whereCondition != '' && this.whereCondition.includes('AND prg.PrgCustID = ')) {
    //     let arryWhere = this.whereCondition.split('AND');
    //     this.whereCondition = '';
    //   }
    // }
    if (this.selectedPrograms.length > 0)
      this.whereCondition += " AND JobAdvanceReport.ProgramId IN (" + this.selectedPrograms.map(x => x.Id) + " )";
    if (this.selectedOrigins.length > 0)
      this.whereCondition += " AND JobAdvanceReport.PlantIDCode IN ('" + this.selectedOrigins.map(x => x.Origin).join("','") + "')";
    if (this.selectedDestinations.length > 0)
      this.whereCondition += " AND JobAdvanceReport.JobSiteCode IN ('" + this.selectedDestinations.map(x => x.Destination).join("','") + "')";
    if (this.selectedBrands.length > 0)
      this.whereCondition += " AND JobAdvanceReport.JobCarrierContract IN ('" + this.selectedBrands.map(x => x.Brand).join("','") + " )'";
    if (this.selectedServiceModes.length > 0)
      this.whereCondition += " AND JobAdvanceReport.JobServiceMode IN ('" + this.selectedServiceModes.map(x => x.ServiceMode).join("','") + "')";
    if (this.selectedProductTypes.length > 0)
      this.whereCondition += " AND JobAdvanceReport.JobProductType IN ('" + this.selectedProductTypes.map(x => x.ProductType).join("','") + "')";
    if (this.selectedJobChannels.length > 0)
      this.whereCondition += " AND JobAdvanceReport.JobChannel IN ('" + this.selectedJobChannels.map(x => x.JobChannel).join("','") + "')";

    if (this.selectedDateTypeNames?.DateTypeName != null && this.selectedDateTypeNames?.DateTypeName != undefined && this.selectedDateTypeNames?.DateTypeName != '') {
      if (this.selectedDateTypeNames?.DateTypeName == 'Order Date') {
        if (this.startDate != null && this.endDate != null && this.startDate != undefined && this.endDate != undefined && this.startDate != '' && this.endDate != '') {
          this.whereCondition += " AND JobAdvanceReport.JobOrderedDate IS NOT NULL  AND CAST(JobAdvanceReport.JobOrderedDate AS DATE) >= '" + this.GetDate(this.startDate) + "' AND CAST(JobAdvanceReport.JobOrderedDate AS DATE) <= '" + this.GetDate(this.endDate) + "'";
        }
        // else {
        //   this.whereCondition += " AND JobAdvanceReport.JobOrderedDate  IS NOT NULL  AND CAST(JobAdvanceReport.JobOrderedDate AS DATE) = " + this.GetDate();
        // }
      }
      else if (this.selectedDateTypeNames?.DateTypeName == 'Delivered Date') {
        if (this.startDate != null && this.endDate != null && this.startDate != undefined && this.endDate != undefined && this.startDate != '' && this.endDate != '') {
          this.whereCondition += " AND JobAdvanceReport.JobDeliveryDateTimeActual IS NOT NULL  AND CAST(JobAdvanceReport.JobDeliveryDateTimeActual AS DATE) >= '" + this.GetDate(this.startDate) + "' AND CAST(JobAdvanceReport.JobDeliveryDateTimeActual AS DATE) <= '" + this.GetDate(this.endDate) + "'";
        }
        //  else {
        //   this.whereCondition += " AND JobAdvanceReport.JobDeliveryDateTimeActual  IS NOT NULL  AND CAST(JobAdvanceReport.JobDeliveryDateTimeActual AS DATE) = " + this.GetDate();
        // }
      }
      else if (this.selectedDateTypeNames?.DateTypeName == 'Shipment Date') {
        if (this.startDate != null && this.endDate != null && this.startDate != undefined && this.endDate != undefined && this.startDate != '' && this.endDate != '') {
          this.whereCondition += " AND JobAdvanceReport.JobShipmentDate IS NOT NULL  AND CAST(JobAdvanceReport.JobShipmentDate AS DATE) >= '" + this.GetDate(this.startDate) + "' AND CAST(JobAdvanceReport.JobShipmentDate AS DATE) <= '" + this.GetDate(this.endDate) + "'";
        }
        // else {
        //   this.whereCondition += " AND JobAdvanceReport.JobShipmentDate  IS NOT NULL  AND CAST(JobAdvanceReport.JobShipmentDate AS DATE) = " + this.GetDate();
        // }
      }
      else if (this.selectedDateTypeNames?.DateTypeName == 'Receive Date') {
        if (this.startDate != null && this.endDate != null && this.startDate != undefined && this.endDate != undefined && this.startDate != '' && this.endDate != '') {
          this.whereCondition += " AND JobAdvanceReport.JobOriginDateTimePlanned IS NOT NULL  AND CAST(JobAdvanceReport.JobOriginDateTimePlanned AS DATE) >= '" + this.GetDate(this.startDate) + "' AND CAST(JobAdvanceReport.JobOriginDateTimePlanned AS DATE) <= '" + this.GetDate(this.endDate) + "'";
        }
        //  else {
        //   this.whereCondition += " AND JobAdvanceReport.JobOriginDateTimePlanned  IS NOT NULL  AND CAST(JobAdvanceReport.JobOriginDateTimePlanned AS DATE) = " + this.GetDate();
        // }
      }
      else if (this.selectedDateTypeNames?.DateTypeName == 'Schedule Date') {
        if (this.startDate != null && this.endDate != null && this.startDate != undefined && this.endDate != undefined && this.startDate != '' && this.endDate != '') {
          this.whereCondition += " AND JobAdvanceReport.JobDeliveryDateTimePlanned IS NOT NULL  AND CAST(JobAdvanceReport.JobDeliveryDateTimePlanned AS DATE) >= '" + this.GetDate(this.startDate) + "' AND CAST(JobAdvanceReport.JobDeliveryDateTimePlanned AS DATE) <= '" + this.GetDate(this.endDate) + "'";
        }
        // else {
        //   this.whereCondition += " AND JobAdvanceReport.JobDeliveryDateTimePlanned  IS NOT NULL  AND CAST(JobAdvanceReport.JobDeliveryDateTimePlanned AS DATE) = " + this.GetDate();
        // }
      }
    }
    this.whereCondition += this.searchText == '' || this.searchText == undefined || this.searchText == null ? "" :
      " AND (cust.CustTitle  LIKE '% " + this.searchText + "%'"
      + " OR JobAdvanceReport.JobBOL LIKE '% " + this.searchText + "%'"
      + " OR JobAdvanceReport.JobCustomerSalesOrder  LIKE '% " + this.searchText + "%'"
      + " OR JobAdvanceReport.JobManifestNo LIKE '% " + this.searchText + "%'"
      + " OR JobAdvanceReport.PlantIDCode LIKE '% " + this.searchText + "%'"
      + " OR JobAdvanceReport.JobSellerSiteName LIKE '% " + this.searchText + "%'"
      + " OR JobAdvanceReport.JobDeliverySiteName  LIKE '% " + this.searchText + "%'"
      + " OR JobAdvanceReport.JobDeliverySitePOC  LIKE '% " + this.searchText + "%'"
      + " OR JobAdvanceReport.JobCarrierContract  LIKE '% " + this.searchText + "%'"
      + " OR JobAdvanceReport.JobSiteCode  LIKE '% " + this.searchText + "%'"
      + " OR JobAdvanceReport.JobDeliverySiteName like '% " + this.searchText + "%'"
      + " OR JobAdvanceReport.JobDeliveryStreetAddress like '% " + this.searchText + "%'"
      + " OR JobAdvanceReport.JobDeliveryStreetAddress2 like '% " + this.searchText + "%'"
      + " OR JobAdvanceReport.JobDeliveryStreetAddress3 like '% " + this.searchText + "%'"
      // + " OR JobAdvanceReport.JobDeliveryStreetAddress4 like '% " + this.searchText + "%'"
      + " OR JobAdvanceReport.JobDeliveryCity like '% " + this.searchText + "%'"
      + " OR JobAdvanceReport.JobDeliveryState like '% " + this.searchText + "%'"
      + " OR JobAdvanceReport.JobDeliveryPostalCode like '% " + this.searchText + "%'"
      + " OR JobAdvanceReport.JobDeliverySitePOCPhone like '% " + this.searchText + "%'"
      + " OR JobAdvanceReport.JobDeliverySitePOCEmail like '% " + this.searchText + "%'"
      + " OR JobAdvanceReport.JobBOLMaster like '% " + this.searchText + "%'"
      + " OR JobAdvanceReport.JobCustomerPurchaseOrder like '% " + this.searchText + "%')";
  }
  GetDate(date: Date = null) {
    if (date == null)
      return new Date().toISOString().slice(0, 10);
    else
      return new Date(date).toISOString().slice(0, 10);
  }
  GetJobAdvanceReportRequest() {
    this.jobAdvanceReportRequest.CustomerId = this.selectedCustomerId;
    this.jobAdvanceReportRequest.StartDate = this.startDate;
    this.jobAdvanceReportRequest.EndDate = this.endDate;
    this.jobAdvanceReportRequest.Scheduled = this.selectedScheduleds?.ScheduledName;
    this.jobAdvanceReportRequest.OrderType = this.selectedOrderTypes?.OrderTypeName;
    this.jobAdvanceReportRequest.PackagingCode = this.selectedPackagingCodes?.PackagingCode;
    this.jobAdvanceReportRequest.CargoId = this.selectedCargoTitles;
    this.jobAdvanceReportRequest.JobStatus = this.selectedJobStatusIdNames?.JobStatusIdName;
    if (this.selectedGatewayStatuses.length > 0)
      this.jobAdvanceReportRequest.GatewayTitle = this.selectedGatewayStatuses.map(x => x.GatewayStatus);

  }
  redirectToDetails = (id: string) => {
    let url = this.router.serializeUrl(this.router.createUrlTree(['/' + routeValues.orderdetails], { queryParams: { id } }));
    url = url.replace("?", ";");
    if (window.location.origin == "https://m4pl-dev.meridianww.com" || window.location.origin == "https://m4pl.meridianww.com")
      window.open(window.location.origin + '/tracking' + url + ';isJobGrid=true', '_blank');
    else
      window.open(window.location.origin + url + ';isJobGrid=true', '_blank');
  }
  download() {
    this.getPagetDataInfo(true);
  }
  downloadCSV(jobModels: Job[]) {
    if (jobModels.length > 0) {
      jobModels.filter(x => this.osdReportColumns);
      let csvData = this.ConvertToCSV(jobModels);
      let a = document.createElement("a");
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      let blob = new Blob([csvData], { type: 'text/csv' });
      let url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = this.reportName + '.csv';
      a.click();
      return 'success';
    } else {
      alert("Records are not available");
    }
  }
  ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var row = "";

    for (var index in objArray[0]) {
      row += index + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';

    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','

        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  }
}
