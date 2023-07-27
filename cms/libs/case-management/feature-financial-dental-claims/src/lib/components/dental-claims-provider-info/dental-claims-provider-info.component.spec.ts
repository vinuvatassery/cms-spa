import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalClaimsProviderInfoComponent } from './dental-claims-provider-info.component';

describe('DentalClaimsProviderInfoComponent', () => {
  let component: DentalClaimsProviderInfoComponent;
  let fixture: ComponentFixture<DentalClaimsProviderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalClaimsProviderInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalClaimsProviderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
