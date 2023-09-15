import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClinicProviderListComponent } from './financial-clinic-provider-list.component';

describe('FinancialClinicProviderListComponent', () => {
  let component: FinancialClinicProviderListComponent;
  let fixture: ComponentFixture<FinancialClinicProviderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialClinicProviderListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialClinicProviderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
