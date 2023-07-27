import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalClaimsPrintAuthorizationComponent } from './dental-claims-print-authorization.component';

describe('DentalClaimsPrintAuthorizationComponent', () => {
  let component: DentalClaimsPrintAuthorizationComponent;
  let fixture: ComponentFixture<DentalClaimsPrintAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalClaimsPrintAuthorizationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalClaimsPrintAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
