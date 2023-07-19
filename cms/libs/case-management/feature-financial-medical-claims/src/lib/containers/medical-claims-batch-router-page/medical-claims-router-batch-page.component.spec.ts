import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsBatchRouterPageComponent } from './medical-claims-router-batch-page.component';

describe('MedicalClaimsBatchRouterPageComponent', () => {
  let component: MedicalClaimsBatchRouterPageComponent;
  let fixture: MedicalClaimsBatchRouterPageComponent<MedicalClaimsRouterBatchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalClaimsBatchRouterPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsBatchRouterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
