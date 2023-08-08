import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyClaimsBatchRouterPageComponent } from './pharmacy-claims-router-batch-page.component';

describe('PharmacyClaimsBatchRouterPageComponent', () => {
  let component: PharmacyClaimsBatchRouterPageComponent;
  let fixture: ComponentFixture<PharmacyClaimsBatchRouterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PharmacyClaimsBatchRouterPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyClaimsBatchRouterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
