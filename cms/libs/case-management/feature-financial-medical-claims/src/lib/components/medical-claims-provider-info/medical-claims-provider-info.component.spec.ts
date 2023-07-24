import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsProviderInfoComponent } from './medical-claims-provider-info.component';

describe('MedicalClaimsProviderInfoComponent', () => {
  let component: MedicalClaimsProviderInfoComponent;
  let fixture: ComponentFixture<MedicalClaimsProviderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalClaimsProviderInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsProviderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
