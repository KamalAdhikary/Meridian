import { Component, OnInit } from '@angular/core';
import { CommonHelper } from 'src/app/utility/commonHelper';
import { Router } from '@angular/router';
import { routeValues } from 'src/app/utility/route-name';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public currentPage;
  public userName: string;
  public menus: any;
  public headerNavigation: string;

  constructor(public commonHelper: CommonHelper, private router: Router) {
    this.currentPage = router.url;
    this.userName = this.commonHelper.getUserName();
  }

  ngOnInit() {
    this.menus = routeValues;
    this.setActiveMenu();
  }
  logout() {
    this.commonHelper.logout();
  }

  setActiveMenu() {
    const routeName = this.currentPage.toString().replace('/', '');
    switch (routeName) {

      // Search
      case routeValues.tracking: {
        this.headerNavigation = 'Search';
        break;
      }
      case routeValues.m4pljobcard: {
        this.headerNavigation = 'DashBoard';
        break;
      }
      default: {
        this.headerNavigation = 'DashBoard';
        break;
      }
    }
  }
}
