import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsRemovePremiumsComponent } from './dental-premiums-remove-premiums.component';

describe('DentalPremiumsRemovePremiumsComponent', () => {
  let component: DentalPremiumsRemovePremiumsComponent;
  let fixture: ComponentFixture<DentalPremiumsRemovePremiumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalPremiumsRemovePremiumsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsRemovePremiumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
