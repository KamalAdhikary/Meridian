import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionExpiryDialogComponent } from './session-expiry-dialog.component';

describe('SessionExpiryDialogComponent', () => {
  let component: SessionExpiryDialogComponent;
  let fixture: ComponentFixture<SessionExpiryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionExpiryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionExpiryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
