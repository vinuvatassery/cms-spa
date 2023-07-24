import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsReconcilePageComponent } from './medical-claims-reconcile-page.component';

describe('MedicalClaimsReconcilePageComponent', () => {
  let component: MedicalClaimsReconcilePageComponent;
  let fixture: ComponentFixture<MedicalClaimsReconcilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalClaimsReconcilePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsReconcilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
