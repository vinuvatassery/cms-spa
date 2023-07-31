import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsReconcilePageComponent } from './dental-premiums-reconcile-page.component';

describe('DentalPremiumsReconcilePageComponent', () => {
  let component: DentalPremiumsReconcilePageComponent;
  let fixture: ComponentFixture<DentalPremiumsReconcilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalPremiumsReconcilePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsReconcilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
