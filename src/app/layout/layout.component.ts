import { Component, OnInit } from '@angular/core';
import { CommonHelper } from '../utility/commonHelper';
import { Router } from '@angular/router';
import { routeValues } from '../utility/route-name';
import { LayoutService } from './layout.service';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  public userName: string;
  public enableSearch = false;

  constructor(public commonHelper: CommonHelper, private router: Router, private layoutService: LayoutService,
    location: PlatformLocation) {
    this.userName = this.commonHelper.getUserName();
    this.enableSearch = true;
    // location.onPopState(() => {
    //   this.router.navigate([routeValues.layout]);
    //   history.forward();
    // });
    // if (this.userName != undefined && this.userName != null) { this.router.navigate(['/' + routeValues.tracking]); }
    // else { this.router.navigate(['/' + routeValues.login]); }
  }

  ngOnInit() {
    if (this.router.url != "/")
      this.router.navigateByUrl(this.router.url);
    else
      this.router.navigate([routeValues.tracking]);
    // if (!this.commonHelper.getToken()) {
    //   this.router.navigate([routeValues.login]);
    //   return;
    // }
  }

  logout() {
    this.commonHelper.logout();
  }
  onMenuClick(menuName: string, isEnabled: boolean) {
    if (isEnabled) {
      switch (menuName.toLowerCase()) {
        case 'tracking':
          this.router.navigate(['/' + routeValues.tracking]);
          break;
      }
    }
  }
}
