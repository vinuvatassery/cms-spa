import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsPrintDenialLetterComponent } from './dental-premiums-print-denial-letter.component';

describe('DentalPremiumsPrintDenialLetterComponent', () => {
  let component: DentalPremiumsPrintDenialLetterComponent;
  let fixture: ComponentFixture<DentalPremiumsPrintDenialLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalPremiumsPrintDenialLetterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsPrintDenialLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
