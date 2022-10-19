import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivatePharmacyComponent } from './deactivate-pharmacy.component';

describe('DeactivatePharmacyComponent', () => {
  let component: DeactivatePharmacyComponent;
  let fixture: ComponentFixture<DeactivatePharmacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeactivatePharmacyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivatePharmacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
