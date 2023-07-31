import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsPrintAuthorizationComponent } from './dental-premiums-print-authorization.component';

describe('DentalPremiumsPrintAuthorizationComponent', () => {
  let component: DentalPremiumsPrintAuthorizationComponent;
  let fixture: ComponentFixture<DentalPremiumsPrintAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalPremiumsPrintAuthorizationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsPrintAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
