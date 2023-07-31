import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyClaimsBatchItemsPageComponent } from './pharmacy-claims-batch-items-page.component';

describe('PharmacyClaimsBatchItemsPageComponent', () => {
  let component: PharmacyClaimsBatchItemsPageComponent;
  let fixture: ComponentFixture<PharmacyClaimsBatchItemsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PharmacyClaimsBatchItemsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyClaimsBatchItemsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
