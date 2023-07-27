import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalClaimsPrintDenialLetterComponent } from './dental-claims-print-denial-letter.component';

describe('DentalClaimsPrintDenialLetterComponent', () => {
  let component: DentalClaimsPrintDenialLetterComponent;
  let fixture: ComponentFixture<DentalClaimsPrintDenialLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalClaimsPrintDenialLetterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalClaimsPrintDenialLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
