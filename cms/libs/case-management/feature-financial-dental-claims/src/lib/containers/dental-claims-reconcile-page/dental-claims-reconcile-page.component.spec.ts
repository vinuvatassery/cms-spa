import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalClaimsReconcilePageComponent } from './dental-claims-reconcile-page.component';

describe('DentalClaimsReconcilePageComponent', () => {
  let component: DentalClaimsReconcilePageComponent;
  let fixture: ComponentFixture<DentalClaimsReconcilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalClaimsReconcilePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalClaimsReconcilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
