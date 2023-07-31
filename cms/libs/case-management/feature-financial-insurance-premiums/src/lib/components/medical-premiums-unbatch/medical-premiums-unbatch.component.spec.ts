import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsUnbatchComponent } from './medical-premiums-unbatch.component'

describe('MedicalPremiumsUnbatchComponent', () => {
  let component: MedicalPremiumsUnbatchComponent;
  let fixture: ComponentFixture<MedicalPremiumsUnbatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalPremiumsUnbatchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsUnbatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
