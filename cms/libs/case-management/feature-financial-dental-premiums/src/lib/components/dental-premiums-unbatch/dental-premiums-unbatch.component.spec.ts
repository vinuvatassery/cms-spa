import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsUnbatchComponent } from './dental-premiums-unbatch.component'

describe('DentalPremiumsUnbatchComponent', () => {
  let component: DentalPremiumsUnbatchComponent;
  let fixture: ComponentFixture<DentalPremiumsUnbatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalPremiumsUnbatchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsUnbatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
