import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClinicProviderRemoveComponent } from './financial-clinic-provider-remove.component';

describe('FinancialClinicProviderRemoveComponent', () => {
  let component: FinancialClinicProviderRemoveComponent;
  let fixture: ComponentFixture<FinancialClinicProviderRemoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialClinicProviderRemoveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialClinicProviderRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
