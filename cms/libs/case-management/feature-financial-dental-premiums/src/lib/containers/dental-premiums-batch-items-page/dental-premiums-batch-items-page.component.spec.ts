import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsBatchItemsPageComponent } from './dental-premiums-batch-items-page.component';

describe('DentalPremiumsBatchItemsPageComponent', () => {
  let component: DentalPremiumsBatchItemsPageComponent;
  let fixture: ComponentFixture<DentalPremiumsBatchItemsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalPremiumsBatchItemsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsBatchItemsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
