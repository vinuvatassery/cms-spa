import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalClaimsBatchRouterPageComponent } from './dental-claims-router-batch-page.component';

describe('DentalClaimsBatchRouterPageComponent', () => {
  let component: DentalClaimsBatchRouterPageComponent;
  let fixture: ComponentFixture<DentalClaimsBatchRouterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalClaimsBatchRouterPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalClaimsBatchRouterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
