import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsPrintAuthorizationComponent } from './medical-claims-print-authorization.component';

describe('MedicalClaimsPrintAuthorizationComponent', () => {
  let component: MedicalClaimsPrintAuthorizationComponent;
  let fixture: ComponentFixture<MedicalClaimsPrintAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalClaimsPrintAuthorizationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsPrintAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
