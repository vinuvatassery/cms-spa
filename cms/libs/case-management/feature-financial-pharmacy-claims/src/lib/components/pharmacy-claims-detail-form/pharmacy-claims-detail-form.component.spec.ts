import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyClaimsDetailFormComponent } from './pharmacy-claims-detail-form.component';

describe('PharmacyClaimsDetailFormComponent', () => {
  let component: PharmacyClaimsDetailFormComponent;
  let fixture: ComponentFixture<PharmacyClaimsDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyClaimsDetailFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyClaimsDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
