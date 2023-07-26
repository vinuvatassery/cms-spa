import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalClaimsBatchListDetailItemsComponent } from './dental-claims-batch-list-detail-items.component';

describe('DentalClaimsBatchListDetailItemsComponent', () => {
  let component: DentalClaimsBatchListDetailItemsComponent;
  let fixture: ComponentFixture<DentalClaimsBatchListDetailItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalClaimsBatchListDetailItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      DentalClaimsBatchListDetailItemsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
