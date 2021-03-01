import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonHelper } from './utility/commonHelper';
import { HttpWrapper } from './utility/httpWrapper';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';
import { SessionExpiryDialogComponent } from './shared/session-expiry-dialog/session-expiry-dialog.component';
import { LayoutComponent } from './layout/layout.component';
import { LayoutService } from './layout/layout.service';
import { SideNavigationComponent } from './dashboard/side-navigation/side-navigation.component';
import { TrackingComponent } from './job/tracking/tracking.component';
import { TrackingService } from './job/tracking/tracking.service';
import { OrderdetailsComponent } from './job/orderdetails/orderdetails.component';
import { OrderdetailsService } from './job/orderdetails/orderdetails.service';
import { from } from 'rxjs';
import { ActionComponent } from './job/action/action.component';
import { ActionService } from './job/action/action.service';
//Mat controls
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { GatewayComponent } from './job/gateway/gateway.component';
import { GatewayService } from './job/gateway/gateway.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMatDateAdapter, NgxMatDateFormats, NgxMatDatetimePicker, NgxMatDatetimePickerModule, NgxMatTimepickerModule, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';
import { FileuploadComponent } from './job/fileupload/fileupload.component';
import { UploadService } from './job/fileupload/upload.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { JobCardService } from './job/jobcard/jobcard.service';
import { JobcardComponent } from './job/jobcard/jobcard.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgSelectModule } from '@ng-select/ng-select';
import { JobreportComponent } from './job/jobreport/jobreport.component';
import { GatewaypopupComponent } from './job/gatewaypopup/gatewaypopup.component';
import { GatewayPopupService } from './job/gatewaypopup/gatewaypopup.service';
import { JobReportService } from './job/jobreport/jobreport.service';
const maskConfig: Partial<IConfig> = {
  validation: false,
};
const DATE_TIME_FORMAT: NgxMatDateFormats = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SessionExpiryDialogComponent,
    LayoutComponent,
    SideNavigationComponent,
    TrackingComponent,
    OrderdetailsComponent,
    ActionComponent,
    GatewayComponent,
    FileuploadComponent,
    JobcardComponent,
    JobreportComponent,
    GatewaypopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatIconModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatInputModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    NgbModule,
    MatSelectModule,
    MatCheckboxModule,
    NgxMaterialTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatTabsModule,
    MatExpansionModule,
    NgSelectModule,
    NgxMaskModule.forRoot(maskConfig),
  ],
  providers: [
    HttpWrapper,
    CommonHelper,
    LoginService,
    LayoutService,
    TrackingService,
    OrderdetailsService,
    ActionService,
    GatewayService,
    UploadService,
    JobCardService,
    GatewayPopupService,
    JobReportService,
    { provide: NGX_MAT_DATE_FORMATS, useValue: DATE_TIME_FORMAT }
  ],
  schemas: [NO_ERRORS_SCHEMA],
  entryComponents: [
    SessionExpiryDialogComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
