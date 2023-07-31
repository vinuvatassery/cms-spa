import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsBatchPageComponent } from '../dental-premiums-batch-page.component;

describe('DentalPremiumsBatchPageComponent', () => {
  let component: DentalPremiumsBatchPageComponent;
  let fixture: ComponentFixture<DentalPremiumsBatchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalPremiumsBatchPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsBatchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
