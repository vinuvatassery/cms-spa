import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsAddDetailsFormComponent } from './dental-premiums-add-details-form.component';

describe('DentalPremiumsAddDetailsFormComponent', () => {
  let component: DentalPremiumsAddDetailsFormComponent;
  let fixture: ComponentFixture<DentalPremiumsAddDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalPremiumsAddDetailsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsAddDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
