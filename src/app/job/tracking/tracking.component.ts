import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TrackingService } from './tracking.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { routeValues } from 'src/app/utility/route-name';
import { CommonHelper } from 'src/app/utility/commonHelper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SearchOrder } from 'src/app/models/SearchOrder';
import { MatSort } from '@angular/material/sort';
import { HttpParams } from '@angular/common/http';
import { Location } from "@angular/common";

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {
  public searchFilter: FormGroup;
  public enableSpinner = false;
  public deliveredFlag = '1';
  public tabIndex = 0;
  public displayedColumns: string[] = ['CustomerSalesOrder', 'GatewayStatus', 'DeliveryDatePlanned', 'ArrivalDatePlanned'];
  public dataSource: any;
  public isInfoToolIconHover = false;
  public tooltipArr: string[];
  public prevSearchResult: string;
  public hasRecord: string = 'none';
  public isM4PLUser = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private formBuilder: FormBuilder, private searchService: TrackingService,
    private snackBar: MatSnackBar, private router: Router, private commonHelper: CommonHelper,
    public dialog: MatDialog, private route: ActivatedRoute, private readonly location: Location,) {

    this.isM4PLUser = this.commonHelper.getToken() != null && this.commonHelper.getToken() != undefined
      ? true : false;
    const data = new Array<SearchOrder>();
    this.dataSource = new MatTableDataSource<SearchOrder>(data);
    if (this.isM4PLUser)
      this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.searchFilter = this.formBuilder.group({
      ctrlSearch: [''],
    });

    if (this.commonHelper.getToken() == null)
      this.tooltipArr = ['Contract#'];
    else
      this.tooltipArr = ['Customer Title', 'BOL', 'BOL Parent', 'Contract#', 'Manifest', 'Plant ID', 'Seller Site Name', 'Delivery Site Name', 'Delivery Site POC', 'Carrier Contract', 'Site Code', 'Delivery Street Address', 'Delivery Street Address 2', 'Delivery Street Address 3', 'Delivery City', 'Delivery State', 'Delivery Postal Code'];
    this.prevSearchResult = this.route.snapshot.paramMap.get('search');
    if (this.prevSearchResult != null || this.prevSearchResult != undefined) {
      this.searchFilter.patchValue({ ctrlSearch: this.prevSearchResult });
      this.search();
    }
  }
  gridDataSource(data: any) {
    if (data != null) {
      this.dataSource = new MatTableDataSource<SearchOrder>(data);
      this.hasRecord = 'block';
    }
    this.dataSource.sort = this.sort;
    if (this.isM4PLUser)
      this.dataSource.paginator = this.paginator;
  }
  ngAfterViewInit(): void {
    this.gridDataSource(null);
  }

  onToggleGroupClick() {
    this.search();
  }

  search() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      if (res.Results.length > 0 && res.Results[0].length === 0) {
        this.hasRecord = 'none';
        this.snackBar.open('No records found', 'OK', { duration: 3000 });
        return;
      }
      this.enableSpinner = false;
      const data = res.Results[0] as Array<SearchOrder>;
      this.gridDataSource(data);
    }, fail = (err) => {
      this.snackBar.open('No records found', 'Close', { duration: 3000 });
      this.enableSpinner = false;
      this.dataSource = null;
    };
    const Search = {
      'search': this.searchFilter.get('ctrlSearch').value,
    };
    if (Search.search === null || Search.search === undefined || Search.search === '') {
      this.enableSpinner = false;
      this.hasRecord = 'none';
      this.snackBar.open('Please provide search input', 'OK', { duration: 3000 });
      return;
    }
    this.searchService.Search(Search.search, success, fail);
  }
  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.search();
    }
  }

  infoToolIcon() {
    this.isInfoToolIconHover = true;
  }

  ClearAll() {
    this.searchFilter.patchValue({
      ctrlSearch: '',
    });
    setTimeout(() => {
      this.deliveredFlag = '1';
      this.dataSource = null;
    }, 100);
  }

  redirectToDetails = (id: string) => {
    this.router.navigate(['/' + routeValues.orderdetails, { id: id }]);
  }
}
