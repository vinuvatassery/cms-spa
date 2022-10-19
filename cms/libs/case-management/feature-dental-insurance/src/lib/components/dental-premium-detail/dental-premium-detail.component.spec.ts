import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumDetailComponent } from './dental-premium-detail.component';

describe('DentalPremiumDetailComponent', () => {
  let component: DentalPremiumDetailComponent;
  let fixture: ComponentFixture<DentalPremiumDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalPremiumDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DentalPremiumDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
