import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsLeavePageComponent } from './dental-premiums-leave-page.component';

describe('DentalPremiumsLeavePageComponent', () => {
  let component: DentalPremiumsLeavePageComponent;
  let fixture: ComponentFixture<DentalPremiumsLeavePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalPremiumsLeavePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsLeavePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
