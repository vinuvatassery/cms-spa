import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsDeleteClaimsComponent } from './medical-premiums-delete-claims.component';

describe('MedicalPremiumsDeleteClaimsComponent', () => {
  let component: MedicalPremiumsDeleteClaimsComponent;
  let fixture: ComponentFixture<MedicalPremiumsDeleteClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalPremiumsDeleteClaimsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsDeleteClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
