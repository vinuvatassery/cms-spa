import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsBatchListDetailItemsComponent } from './dental-premiums-batch-list-detail-items.component';

describe('DentalPremiumsBatchListDetailItemsComponent', () => {
  let component: DentalPremiumsBatchListDetailItemsComponent;
  let fixture: ComponentFixture<DentalPremiumsBatchListDetailItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalPremiumsBatchListDetailItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      DentalPremiumsBatchListDetailItemsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
