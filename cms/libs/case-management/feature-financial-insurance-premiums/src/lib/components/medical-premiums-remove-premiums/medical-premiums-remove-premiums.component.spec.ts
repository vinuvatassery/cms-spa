import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsDeletePremiumsComponent } from./medical-premiums-delete-premiums.componentnent';

describe('MedicalPremiumsDeletePremiumsComponent', () => {
  let component: MedicalPremiumsDeletePremiumsComponent;
  let fixture: ComponentFixture<MedicalPremiumsDeletePremiumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalPremiumsDeletePremiumsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsDeletePremiumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
