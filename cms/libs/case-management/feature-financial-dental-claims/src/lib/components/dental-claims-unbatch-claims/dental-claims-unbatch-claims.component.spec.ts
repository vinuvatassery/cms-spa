import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalClaimsUnbatchClaimsComponent } from './dental-claims-unbatch-claims.component';

describe('DentalClaimsUnbatchClaimsComponent', () => {
  let component: DentalClaimsUnbatchClaimsComponent;
  let fixture: ComponentFixture<DentalClaimsUnbatchClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalClaimsUnbatchClaimsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalClaimsUnbatchClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
