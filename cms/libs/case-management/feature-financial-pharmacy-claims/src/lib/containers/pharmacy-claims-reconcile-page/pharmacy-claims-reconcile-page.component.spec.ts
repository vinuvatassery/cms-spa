import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyClaimsReconcilePageComponent } from './pharmacy-claims-reconcile-page.component';

describe('PharmacyClaimsReconcilePageComponent', () => {
  let component: PharmacyClaimsReconcilePageComponent;
  let fixture: ComponentFixture<PharmacyClaimsReconcilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PharmacyClaimsReconcilePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyClaimsReconcilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
