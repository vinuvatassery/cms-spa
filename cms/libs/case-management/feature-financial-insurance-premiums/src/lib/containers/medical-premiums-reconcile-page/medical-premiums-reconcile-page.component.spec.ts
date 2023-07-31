import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsReconcilePageComponent } from './medical-premiums-reconcile-page.component';

describe('MedicalPremiumsReconcilePageComponent', () => {
  let component: MedicalPremiumsReconcilePageComponent;
  let fixture: ComponentFixture<MedicalPremiumsReconcilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumsReconcilePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsReconcilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
