import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCarrierDetailsComponent } from './insruance-carrier-details.component';

describe('InsuranceCarrierDetailsComponent', () => {
  let component: InsuranceCarrierDetailsComponent;
  let fixture: ComponentFixture<InsuranceCarrierDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsuranceCarrierDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InsuranceCarrierDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
