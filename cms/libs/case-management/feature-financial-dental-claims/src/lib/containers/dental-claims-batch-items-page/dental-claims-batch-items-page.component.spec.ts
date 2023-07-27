import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalClaimsBatchItemsPageComponent } from './dental-claims-batch-items-page.component';

describe('DentalClaimsBatchItemsPageComponent', () => {
  let component: DentalClaimsBatchItemsPageComponent;
  let fixture: ComponentFixture<DentalClaimsBatchItemsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalClaimsBatchItemsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalClaimsBatchItemsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
