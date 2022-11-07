import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalInsuranceStatusDetailComponent } from './dental-insurance-status-detail.component';

describe('DentalInsuranceStatusDetailComponent', () => {
  let component: DentalInsuranceStatusDetailComponent;
  let fixture: ComponentFixture<DentalInsuranceStatusDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalInsuranceStatusDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DentalInsuranceStatusDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
