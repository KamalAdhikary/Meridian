import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewaypopupComponent } from './gatewaypopup.component';

describe('GatewaypopupComponent', () => {
  let component: GatewaypopupComponent;
  let fixture: ComponentFixture<GatewaypopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewaypopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewaypopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
