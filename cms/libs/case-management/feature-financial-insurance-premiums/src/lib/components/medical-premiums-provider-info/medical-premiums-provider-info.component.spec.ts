import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsProviderInfoComponent } from './medical-premiums-provider-info.component';

describe('MedicalPremiumsProviderInfoComponent', () => {
  let component: MedicalPremiumsProviderInfoComponent;
  let fixture: ComponentFixture<MedicalPremiumsProviderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalPremiumsProviderInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsProviderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
