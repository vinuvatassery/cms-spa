import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalInsuranceStatusListComponent } from './medical-insurance-status-list.component';

describe('MedicalInsuranceStatusListComponent', () => {
  let component: MedicalInsuranceStatusListComponent;
  let fixture: ComponentFixture<MedicalInsuranceStatusListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalInsuranceStatusListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalInsuranceStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
