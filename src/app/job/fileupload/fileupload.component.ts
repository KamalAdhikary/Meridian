import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpEventType, HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UploadService } from 'src/app/job/fileupload/upload.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { SysOption } from 'src/app/models/SysOption';
import { routeValues } from 'src/app/utility/route-name';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss']
})
export class FileuploadComponent implements OnInit {
  public fileUploadForm: FormGroup;
  public codeText: string;
  public showfileRecord: any = 'none';
  public jobId: string;
  public docTypes: Array<SysOption>;
  public enableSpinner = false;
  public documentTypeText: string;
  public docTypeId: number;
  public errorMessage: string;
  public filesToUpload: Array<File>;
  public selectedFileNames: string[] = [];
  public isLoadingData: Boolean = false;
  public uploadResult: any;
  public res: Array<string>;

  @ViewChild('fileUpload') fileUploadVar: any;

  constructor(private router: Router, private route: ActivatedRoute, private allDialogRef: MatDialog, private uploadService: UploadService,
    private snackBar: MatSnackBar, private formBuilder: FormBuilder, private http: HttpClient) {
    this.errorMessage = "";
    this.filesToUpload = [];
    this.selectedFileNames = [];
    this.uploadResult = "";
  }

  ngOnInit(): void {
    this.fileUploadForm = this.formBuilder.group({
      code: [''],
      file: [null],
      doctype: 206
    });

    this.jobId = this.route.snapshot.paramMap.get('id');
    this.getDocType();
  }
  getDocType() {
    this.enableSpinner = true;
    const success = (res) => {
      this.enableSpinner = false;
      if (res.Results.length > 0) {
        const result = res.Results;
        this.docTypes = result;
        this.fileUploadForm.patchValue({
          doctype: 206,
          code: 'POD'
        });
      }
    }, fail = (err) => {
      this.enableSpinner = false;
      this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
    };
    this.uploadService.getLookup(1010, success, fail);
  }

  onSelectDocumentType(event) {
    this.docTypeId = event.value != 0 ? event.value : null;
    if (this.docTypeId != null) {
      let code = this.docTypes.filter(x => x.SysRefId == this.docTypeId)[0].SysRefName;
      this.fileUploadForm.patchValue({
        doctype: event.value,
        code: code
      });
    }
  }

  backToOrderDetail() {
    this.router.navigate(['/' + routeValues.orderdetails, { id: this.jobId }]);
  }
  cancelUpload() {
    this.router.navigate(['/' + routeValues.orderdetails, { id: this.jobId }]);
  }
  remove(index) {
    this.selectedFileNames.splice(index, 1);
    if (this.selectedFileNames.length > 0) {
      this.showfileRecord = 'block';
    } else {
      this.showfileRecord = 'none';
    }
  }

  fileChangeEvent(fileInput: any) {
    this.uploadResult = "";
    this.filesToUpload = <Array<File>>fileInput.target.files;

    for (let i = 0; i < this.filesToUpload.length; i++) {
      if (this.filesToUpload[i].size / 1024 / 1024 < 10) {
        this.selectedFileNames.push(this.filesToUpload[i].name);
      } else {
        this.snackBar.open('Uploaded ' + this.filesToUpload[i].name + 'size more than 10MB', 'CLOSE', { duration: 3000 });
        this.filesToUpload = [];
        this.fileUploadVar.nativeElement.value = "";
        this.selectedFileNames = [];
        this.showfileRecord = 'none';
        return;
        // this.filesToUpload[i].size / 1024 / 1024 + "MB");
      }
    }
    if (this.selectedFileNames.length > 0) {
      this.showfileRecord = 'block';
    } else {
      this.showfileRecord = 'none';
    }
  }

  cancel() {
    this.filesToUpload = [];
    this.fileUploadVar.nativeElement.value = "";
    this.selectedFileNames = [];
    this.uploadResult = "";
    this.errorMessage = "";
    this.showfileRecord = 'none';
    this.fileUploadForm.patchValue({
      code: 'POD',
      file: [null],
      doctype: 206,
    });
  }

  submit() {
    if (this.codeText == null || this.codeText == undefined || this.codeText == '') {
      this.snackBar.open('Code is required', 'CLOSE', { duration: 3000 });
    } else if (this.codeText.length > 50) {
      this.snackBar.open('Only 50 character is acceptable', 'CLOSE', { duration: 3000 });
    }
    else if (this.filesToUpload.length == 0) {
      this.snackBar.open('Please select at least 1 file to upload!', 'CLOSE', { duration: 3000 });
    }
    else {
      this.uploadFiles();
    }
  }

  uploadFiles() {
    this.uploadResult = "";
    this.enableSpinner = true;

    if (this.filesToUpload.length > 0) {
      this.isLoadingData = true;

      let formData: FormData = new FormData();
      formData.append('JobId', this.jobId);
      formData.append('JdrCode', this.codeText);
      formData.append('DocTypeId', this.fileUploadForm.get('doctype').value.toString());

      for (var i = 0; i < this.filesToUpload.length; i++) {
        formData.append('uploadedFiles', this.filesToUpload[i], this.filesToUpload[i].name);
      }

      const success = (res) => {
        this.enableSpinner = false;
        this.uploadResult = res;
        this.errorMessage = "";
        this.snackBar.open('File uploaded successfully', 'CLOSE', { duration: 3000 });
        this.router.navigate(['/' + routeValues.orderdetails, { id: this.jobId }]);
      }, fail = (err) => {
        this.enableSpinner = false;
        this.errorMessage = err;
        this.snackBar.open('Some error occured', 'CLOSE', { duration: 3000 });
      };
      this.uploadService.addDocReference(formData, success, fail);
    }
  }
}
