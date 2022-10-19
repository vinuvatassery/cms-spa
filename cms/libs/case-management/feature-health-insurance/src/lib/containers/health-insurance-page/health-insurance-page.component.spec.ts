import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthInsurancePageComponent } from './health-insurance-page.component';

describe('HealthInsurancePageComponent', () => {
  let component: HealthInsurancePageComponent;
  let fixture: ComponentFixture<HealthInsurancePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthInsurancePageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthInsurancePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
