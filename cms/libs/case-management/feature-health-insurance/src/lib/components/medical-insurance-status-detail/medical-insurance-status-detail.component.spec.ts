import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalInsuranceStatusDetailComponent } from './medical-insurance-status-detail.component';

describe('MedicalInsuranceStatusDetailComponent', () => {
  let component: MedicalInsuranceStatusDetailComponent;
  let fixture: ComponentFixture<MedicalInsuranceStatusDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalInsuranceStatusDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalInsuranceStatusDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
