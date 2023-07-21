import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsDeleteClaimsComponent } from './medical-claims-delete-claims.component';

describe('MedicalClaimsDeleteClaimsComponent', () => {
  let component: MedicalClaimsDeleteClaimsComponent;
  let fixture: ComponentFixture<MedicalClaimsDeleteClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalClaimsDeleteClaimsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsDeleteClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
