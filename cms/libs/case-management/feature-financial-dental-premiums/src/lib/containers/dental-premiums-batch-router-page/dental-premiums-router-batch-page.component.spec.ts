import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsBatchRouterPageComponent } from './dental-premiums-router-batch-page.component';

describe('DentalPremiumsBatchRouterPageComponent', () => {
  let component: DentalPremiumsBatchRouterPageComponent;
  let fixture: ComponentFixture<DentalPremiumsBatchRouterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalPremiumsBatchRouterPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsBatchRouterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
