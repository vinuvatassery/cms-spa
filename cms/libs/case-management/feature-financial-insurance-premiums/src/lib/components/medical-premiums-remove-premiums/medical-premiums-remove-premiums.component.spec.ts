import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsRemovePremiumsComponent } from'./medical-premiums-remove-premiums.component';

describe('MedicalPremiumsRemovePremiumsComponent', () => {
  let component: MedicalPremiumsRemovePremiumsComponent;
  let fixture: ComponentFixture<MedicalPremiumsRemovePremiumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalPremiumsRemovePremiumsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsRemovePremiumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
