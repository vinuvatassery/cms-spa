import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsDetailFormComponent } from './medical-claims-detail-form.component';

describe('MedicalClaimsDetailFormComponent', () => {
  let component: MedicalClaimsDetailFormComponent;
  let fixture: ComponentFixture<MedicalClaimsDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalClaimsDetailFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
