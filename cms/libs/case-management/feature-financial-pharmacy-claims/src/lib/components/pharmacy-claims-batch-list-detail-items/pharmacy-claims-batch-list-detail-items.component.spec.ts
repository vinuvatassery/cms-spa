import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyClaimsBatchListDetailItemsComponent } from './pharmacy-claims-batch-list-detail-items.component';

describe('PharmacyClaimsBatchListDetailItemsComponent', () => {
  let component: PharmacyClaimsBatchListDetailItemsComponent;
  let fixture: ComponentFixture<PharmacyClaimsBatchListDetailItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyClaimsBatchListDetailItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      PharmacyClaimsBatchListDetailItemsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
