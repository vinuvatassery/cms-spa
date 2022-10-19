import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalInsuranceStatusListComponent } from './dental-insurance-status-list.component';

describe('DentalInsuranceStatusListComponent', () => {
  let component: DentalInsuranceStatusListComponent;
  let fixture: ComponentFixture<DentalInsuranceStatusListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalInsuranceStatusListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DentalInsuranceStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
