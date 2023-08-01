import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsPrintAuthorizationComponent } from './medical-premiums-print-authorization.component';

describe('MedicalPremiumsPrintAuthorizationComponent', () => {
  let component: MedicalPremiumsPrintAuthorizationComponent;
  let fixture: ComponentFixture<MedicalPremiumsPrintAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalPremiumsPrintAuthorizationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsPrintAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
