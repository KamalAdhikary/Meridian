import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Observable, merge, of, fromEvent } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Component({
  selector: 'app-session-expiry-dialog',
  templateUrl: './session-expiry-dialog.component.html',
  styleUrls: ['./session-expiry-dialog.component.scss']
})
export class SessionExpiryDialogComponent implements OnInit {
  hasInternetConnection: Observable<boolean>;
  message: string;
  constructor(private allDialogRef: MatDialog) {
    this.hasInternetConnection = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    );

    this.hasInternetConnection.subscribe((data: boolean) => {
      if (!data) {
        this.message = 'Your internet connection is offline.';
      } else {
        this.message = 'Your session has been expired. Please login again.';
      }
    });
  }

  ngOnInit() {
  }
  closeWindow() {
    this.allDialogRef.closeAll();
  }
}
