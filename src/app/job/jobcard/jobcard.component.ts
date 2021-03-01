import { Component, OnInit, ViewChild } from '@angular/core';
import { JobCardService } from './jobcard.service';
import { JobCardCondition } from 'src/app/models/JobCardCondition';
import { JobCardTile, JobCardTileDetail } from 'src/app/models/JobCardTileDetail';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EntitiesAlias, JobCardRequest, PagedDataInfo } from 'src/app/models/JobCardRequest';
import { Job } from 'src/app/models/Job';
import { ActiveUser } from 'src/app/models/ActiveUser';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { routeValues } from 'src/app/utility/route-name';
import { Customer, JobDestination } from 'src/app/models/JobCard';
import { NgModel } from '@angular/forms';
import { strings } from '@material/tabs/tab/constants';

@Component({
  selector: 'app-jobcard',
  templateUrl: './jobcard.component.html',
  styleUrls: ['./jobcard.component.scss']
})
export class JobcardComponent implements OnInit {
  public jobCardCondition = new JobCardCondition();
  public JobCardTileDetails: JobCardTileDetail[];
  public JobCardTileDataDetails: JobCardTile[] = new Array<JobCardTile>();
  public enableSpinner: boolean = false;
  public pagedDataInfo = new PagedDataInfo();
  public jobCardRequest = new JobCardRequest();
  public isShow: boolean = true;
  public jobModels: Job[];
  public pageNumber: number = 1;
  public pageSize: number = 30;
  public categoryName: string;
  public subCategoryName: string;
  public relationalId: number;
  public TotalCount: number = 0;
  public activeUserObj = new ActiveUser();
  public dashboardCategoryDisplayName: string = '';
  public dashboardSubCategoryDisplayName: string = '';
  public displayedColumns: string[] =
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
    ];
  public dataSource: any;
  public jobDestinationModel: JobDestination[] = [];
  public jobDestinationDetails: JobDestination[] = [];
  public selectedDestinations: [];
  public customerList: Customer[] = [];
  public selectedCustomers = [];
  public selectedCustomerId: number = 0;
  public whereCondition: string = '';
  public custWhereCondition: string = '';
  public destWhereCondition: string = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private jobCardService: JobCardService, private snackBar: MatSnackBar,
    public dialog: MatDialog, private router: Router) {
    this.activeUserObj = JSON.parse(localStorage.getItem("GetActiveUser")) as ActiveUser;
  }
  ngOnInit(): void {
    this.getCustomerDetails();
    this.getDestinationDetails(0);
    this.getCardTileDetails(0, '');
  }
  getCardTileDetails(companyId: number, whereCondition: string) {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.JobCardTileDetails = res.Results as JobCardTileDetail[];
      let CategoryNames = [...new Set(this.JobCardTileDetails.map(item => item.DashboardCategoryDisplayName))];
      this.JobCardTileDataDetails = new Array<JobCardTile>();
      CategoryNames.forEach(element => {
        this.JobCardTileDataDetails.push({
          'CategoryName': element,
          'JobCardTileDetailList': this.JobCardTileDetails.filter(m => m.DashboardCategoryDisplayName == element) as JobCardTileDetail[]
        });
      });
      if (this.JobCardTileDataDetails.length == 5)
        [this.JobCardTileDataDetails[3], this.JobCardTileDataDetails[4]] = [this.JobCardTileDataDetails[4], this.JobCardTileDataDetails[3]];
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.jobCardCondition.CompanyId = companyId;
    this.jobCardCondition.WhereCondition = whereCondition;
    this.jobCardService.getCardTileDetails(this.jobCardCondition, success, fail);
  }
  getDestinationDetails(customerId: number) {
    const success = (res) => {
      this.selectedDestinations = [];
      this.jobDestinationModel = res.Results.length > 0 ? res.Results[0] as JobDestination[] : [];
    }, fail = (err) => {
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };

    this.jobCardService.getDestinationDetails(customerId, success, fail);
  }
  CardCLick(categoryName: string, subCategoryName: string, relationalId: number, DashboardCategoryDisplayName: string, DashboardSubCategoryDisplayName: string,) {
    this.isShow = false;
    this.categoryName = categoryName;
    this.subCategoryName = subCategoryName;
    this.relationalId = relationalId;
    this.dashboardCategoryDisplayName = DashboardCategoryDisplayName;
    this.dashboardSubCategoryDisplayName = DashboardSubCategoryDisplayName;
    if (this.activeUserObj == null)
      this.activeUserObj = JSON.parse(localStorage.getItem("GetActiveUser")) as ActiveUser;
    if (this.activeUserObj != null && this.activeUserObj.IsSysAdmin != null && !this.activeUserObj.IsSysAdmin) {
      var index = this.displayedColumns.indexOf("Id");
      if (index !== -1) {
        this.displayedColumns.splice(index, 1);
      }
    }
    this.getPagetDataInfo(categoryName, subCategoryName, relationalId);
  }
  getPagetDataInfo(categoryName: string, subCategoryName: string, relationalId: number) {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      this.jobModels = res.Results as Job[];
      this.TotalCount = res.TotalResults;
      this.dataSource = new MatTableDataSource<Job>(this.jobModels);
      this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.jobCardRequest.CustomerId = this.selectedCustomerId;
    this.jobCardRequest.DashboardCategoryRelationId = relationalId;
    this.jobCardRequest.DashboardCategoryName = categoryName;
    this.jobCardRequest.DashboardSubCategoryName = subCategoryName;
    this.pagedDataInfo.UserId = this.activeUserObj.UserId;
    this.pagedDataInfo.OrganizationId = this.activeUserObj.OrganizationId;
    this.pagedDataInfo.RoleId = this.activeUserObj.RoleId;
    this.pagedDataInfo.PageNumber = this.pageNumber;
    this.pagedDataInfo.PageSize = this.pageSize;
    this.pagedDataInfo.IsNext = false;
    this.pagedDataInfo.IsEnd = false;
    this.pagedDataInfo.Entity = EntitiesAlias.JobCard;
    this.pagedDataInfo.WhereCondition = this.whereCondition;
    this.pagedDataInfo.Params = JSON.stringify(this.jobCardRequest);
    this.jobCardService.PagedData(this.pagedDataInfo, success, fail);
  }
  goBackToCard() {
    this.isShow = true;
    this.categoryName = '';
    this.subCategoryName = '';
    this.relationalId = 0;
    this.TotalCount = 0;
    this.dataSource = new MatTableDataSource<Job>(null);
  }
  redirectToDetails = (id: string) => {
    let url = this.router.serializeUrl(this.router.createUrlTree(['/' + routeValues.orderdetails], { queryParams: { id } }));
    url = url.replace("?", ";");
    if (window.location.origin == "https://m4pl-dev.meridianww.com" || window.location.origin == "https://m4pl.meridianww.com")
      window.open(window.location.origin + '/tracking' + url + ';isJobGrid=true', '_blank');
    else
      window.open(window.location.origin + url + ';isJobGrid=true', '_blank');
  }
  PageEvents(event: PageEvent) {
    this.pageSize = +event.pageSize;
    this.pageNumber = +event.pageIndex + 1;
    this.getPagetDataInfo(this.categoryName, this.subCategoryName, this.relationalId);
  }
  getCustomerDetails() {
    const success = (res) => {
      this.customerList = res.Results[0] as Customer[];
      this.customerList = this.customerList.filter(x => x.CustOrgId == 1);
    }, fail = (err) => {
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
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
    this.jobCardService.getCustomerDetails(postData, success, fail);
  }
  getCustomer(event) {
    this.selectedDestinations = [];
    if (event != null && event != undefined && event.Id > 0) {
      this.selectedCustomerId = parseInt(event["Id"]);
      this.getDestinationDetails(this.selectedCustomerId);
      this.whereCondition = this.custWhereCondition = " AND JOBDL000Master.PrgCustId = " + this.selectedCustomerId + " ";
      this.getCardTileDetails(this.selectedCustomerId, this.whereCondition);
    }
    else {
      this.selectedCustomerId = 0;
      this.whereCondition = this.custWhereCondition = '';
      this.getDestinationDetails(0);
      this.getCardTileDetails(this.selectedCustomerId, this.whereCondition);
    }
  }
  onDestinationChange(event) {
    if (event != null && event.length > 0) {
      let selectedDestinations = event as JobDestination[];
      this.destWhereCondition += " AND JOBDL000Master.JobSiteCode IN ('" + selectedDestinations.join("','") + "') ";
      this.whereCondition += this.destWhereCondition;
      this.getCardTileDetails(this.selectedCustomerId, this.whereCondition);
    }
    else {
      this.whereCondition = this.deleteWord(this.destWhereCondition, this.whereCondition);
      this.destWhereCondition = '';
      this.getCardTileDetails(this.selectedCustomerId, this.whereCondition);
    }
  }
  deleteWord(searchTerm, str) {
    var n = str.search(searchTerm);
    while (str.search(searchTerm) > -1) {
      n = str.search(searchTerm);
      str = str.substring(0, n) + str.substring(n + searchTerm.length, str.length);
    }
    return str;
  }
}
