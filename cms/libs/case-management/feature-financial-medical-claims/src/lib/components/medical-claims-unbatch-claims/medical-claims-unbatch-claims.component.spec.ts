import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsUnbatchClaimsComponent } from './medical-claims-unbatch-claims.component';

describe('MedicalClaimsUnbatchClaimsComponent', () => {
  let component: MedicalClaimsUnbatchClaimsComponent;
  let fixture: ComponentFixture<MedicalClaimsUnbatchClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalClaimsUnbatchClaimsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsUnbatchClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
