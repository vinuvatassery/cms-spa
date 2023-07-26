import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsPrintDenialLetterComponent } from './medical-premiums-print-denial-letter.component';

describe('MedicalPremiumsPrintDenialLetterComponent', () => {
  let component: MedicalPremiumsPrintDenialLetterComponent;
  let fixture: ComponentFixture<MedicalPremiumsPrintDenialLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumsPrintDenialLetterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsPrintDenialLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
