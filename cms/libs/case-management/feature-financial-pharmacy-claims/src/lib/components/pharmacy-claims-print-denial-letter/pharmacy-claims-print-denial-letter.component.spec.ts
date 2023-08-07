import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyClaimsPrintDenialLetterComponent } from './pharmacy-claims-print-denial-letter.component';

describe('PharmacyClaimsPrintDenialLetterComponent', () => {
  let component: PharmacyClaimsPrintDenialLetterComponent;
  let fixture: ComponentFixture<PharmacyClaimsPrintDenialLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PharmacyClaimsPrintDenialLetterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyClaimsPrintDenialLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
