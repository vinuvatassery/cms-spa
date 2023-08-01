import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsAddDetailsFormComponent } from './medical-premiums-add-details-form.component';

describe('MedicalPremiumsAddDetailsFormComponent', () => {
  let component: MedicalPremiumsAddDetailsFormComponent;
  let fixture: ComponentFixture<MedicalPremiumsAddDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumsAddDetailsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsAddDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
