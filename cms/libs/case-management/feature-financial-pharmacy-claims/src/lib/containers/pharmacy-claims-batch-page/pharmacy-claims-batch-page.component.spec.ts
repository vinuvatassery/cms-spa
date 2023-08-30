import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyClaimsBatchPageComponent } from '../pharmacy-claims-batch-page.component';

describe('PharmacyClaimsBatchPageComponent', () => {
  let component: PharmacyClaimsBatchPageComponent;
  let fixture: ComponentFixture<PharmacyClaimsBatchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PharmacyClaimsBatchPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyClaimsBatchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
