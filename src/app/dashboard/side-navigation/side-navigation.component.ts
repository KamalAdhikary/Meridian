import { Component, OnInit } from '@angular/core';
import { routeValues } from 'src/app/utility/route-name';
import { Router } from '@angular/router';
import { CommonHelper } from 'src/app/utility/commonHelper';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss']
})
export class SideNavigationComponent implements OnInit {

  public m4pljobcard = false;
  public tracking = false;
  public jobreport = false;
  public currentPage;
  public routename: any;
  public menuName: any;
  public headerNavigation: string;
  public toggleSidebar = true;
  public userName: string;
  public hover = false;
  public isAuthorize = false;
  public isShowNav = false;
  public modal: any;


  constructor(private router: Router, public commonHelper: CommonHelper) {
    this.currentPage = router.url;
    this.userName = this.commonHelper.getUserName();
  }

  ngOnInit() {
    this.modal = document.getElementById("card1");

    this.routename = routeValues;
    const pageName = this.currentPage.toString().replace('/', '');
    //this.currentPage.toString().replace('/', '').substring(0, this.currentPage.toString().replace('/', '').indexOf(';'));

    this.setActiveMenu(pageName);
    this.isAuthorize = this.commonHelper.getToken() == null ? false : true;
  }

  // onHover(){
  //   this.hover = !this.hover;
  // }

  collapseSidebar(menuName: string) {
    this.toggleSidebar = !this.toggleSidebar;
    if (this.toggleSidebar) {
      switch (menuName.toLowerCase()) {
        case 'tracking':
          this.router.navigate(['/' + routeValues.tracking]);
          this.setActiveMenu(routeValues.tracking);
          break;
        case 'm4pljobcard':
          this.router.navigate(['/' + routeValues.m4pljobcard]);
          this.setActiveMenu(routeValues.m4pljobcard);
          break;
        case 'jobreport':
          this.router.navigate(['/' + routeValues.jobreport]);
          this.setActiveMenu(routeValues.jobreport);
          break;
        // default:
        //   this.router.navigate(['/' + routeValues.tracking]);
        //   this.setActiveMenu(routeValues.tracking);
        //   break;
      }
    }
  }

  setActiveMenu(routeName: string) {
    this.tracking = false;
    this.m4pljobcard = false;
    this.jobreport = false;
    switch (routeName) {
      case routeValues.tracking: {
        this.tracking = true;
        this.headerNavigation = 'Tracking';
        break;
      }
      case routeValues.m4pljobcard: {
        this.m4pljobcard = true;
        this.headerNavigation = 'DashBoard';
        break;
      }
      case routeValues.jobreport: {
        this.jobreport = true;
        this.headerNavigation = 'Report';
        break;
      }
      // default: {
      //   this.tracking = true;
      //   this.headerNavigation = 'Tracking';
      //   break;
      // }
    }
  }


  Show(isShow: boolean) {
    if (!isShow) {
      this.isShowNav = true;
      // var navList = document.getElementById("nav-lists");
      // navList.classList.add("_Menus-show");
    }
    else {
      this.isShowNav = false;
      // var navList = document.getElementById("nav-lists");
      // navList.classList.remove("_Menus-show");
    }
  }

  myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }
  hasAccessMenu(menuName: string) {
    const enableMenuList = this.getMenu();
    if (enableMenuList !== null && enableMenuList.indexOf(menuName) !== -1) {
      return true;
    }
    return false;
  }
  getMenu() {
    if (this.isAuthorize) {
      let menuList: string[] = ['tracking', 'order', 'm4pljobcard','jobreport'];
      return menuList;
    }
    return null;
  }
  activeSubmenu(routeName: string) {
    const currentPage = this.currentPage.toString().replace('/', '');
    if (routeName.toLowerCase() === currentPage.toLowerCase()) {
      return true;
    }
    return false;
  }
  login() {
    this.router.navigate(['/' + routeValues.login]);
  }
  logout() {
    this.isAuthorize = false;
    this.Show(true);
    this.commonHelper.logout();
    this.modal.style.display = "none";
  }

  clickUser() {
    this.modal.style.display = "contents";
  }

  clickClose() {
    this.modal.style.display = "none";
  }
}
