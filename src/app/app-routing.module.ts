import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { routeValues } from './utility/route-name';
import { TrackingComponent } from './job/tracking/tracking.component';
import { OrderdetailsComponent } from './job/orderdetails/orderdetails.component';
import { ActionComponent } from './job/action/action.component';
import { GatewayComponent } from './job/gateway/gateway.component';
import { FileuploadComponent } from './job/fileupload/fileupload.component';
import { JobcardComponent } from './job/jobcard/jobcard.component';
import { JobreportComponent } from './job/jobreport/jobreport.component';

const routes: Routes = [
  // Default landing page

  // child route goes to here
  { path: routeValues.login, component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: LayoutComponent },
      { path: routeValues.orderdetails, component: OrderdetailsComponent },
      { path: routeValues.tracking, component: TrackingComponent },
      { path: routeValues.action, component: ActionComponent },
      { path: routeValues.gateway, component: GatewayComponent },
      { path: routeValues.fileupload, component: FileuploadComponent },
      { path: routeValues.m4pljobcard, component: JobcardComponent },
      { path: routeValues.jobreport, component: JobreportComponent },
    ]
  },

  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
// , { onSameUrlNavigation: 'reload' }
export class AppRoutingModule { }
