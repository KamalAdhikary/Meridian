import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobreportComponent } from './jobreport.component';

describe('JobreportComponent', () => {
  let component: JobreportComponent;
  let fixture: ComponentFixture<JobreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
