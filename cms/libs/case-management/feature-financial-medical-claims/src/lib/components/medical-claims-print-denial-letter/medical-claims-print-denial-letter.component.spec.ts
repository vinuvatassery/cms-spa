import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsPrintDenialLetterComponent } from './medical-claims-print-denial-letter.component';

describe('MedicalClaimsPrintDenialLetterComponent', () => {
  let component: MedicalClaimsPrintDenialLetterComponent;
  let fixture: ComponentFixture<MedicalClaimsPrintDenialLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalClaimsPrintDenialLetterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsPrintDenialLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
