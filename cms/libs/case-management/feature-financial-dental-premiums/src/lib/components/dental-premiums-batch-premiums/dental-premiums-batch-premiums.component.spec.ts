import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsBatchPremiumsComponent } from './dental-premiums-batch-premiums.component';

describe('DentalPremiumsBatchPremiumsComponent', () => {
  let component: DentalPremiumsBatchPremiumsComponent;
  let fixture: ComponentFixture<DentalPremiumsBatchPremiumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalPremiumsBatchPremiumsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsBatchPremiumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
