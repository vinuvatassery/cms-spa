import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClinicProviderDetailsComponent } from './financial-clinic-provider-details.component';

describe('FinancialClinicProviderDetailsComponent', () => {
  let component: FinancialClinicProviderDetailsComponent;
  let fixture: ComponentFixture<FinancialClinicProviderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialClinicProviderDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialClinicProviderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
