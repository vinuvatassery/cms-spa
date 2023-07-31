import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsProviderInfoComponent } from './dental-premiums-provider-info.component';

describe('DentalPremiumsProviderInfoComponent', () => {
  let component: DentalPremiumsProviderInfoComponent;
  let fixture: ComponentFixture<DentalPremiumsProviderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalPremiumsProviderInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsProviderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
