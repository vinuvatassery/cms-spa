import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalClaimsDeleteClaimsComponent } from './dental-claims-delete-claims.component';

describe('DentalClaimsDeleteClaimsComponent', () => {
  let component: DentalClaimsDeleteClaimsComponent;
  let fixture: ComponentFixture<DentalClaimsDeleteClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalClaimsDeleteClaimsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalClaimsDeleteClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
