import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalClaimsBatchPageComponent } from '../dental-claims-batch-page.component;

describe('DentalClaimsBatchPageComponent', () => {
  let component: DentalClaimsBatchPageComponent;
  let fixture: ComponentFixture<DentalClaimsBatchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalClaimsBatchPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalClaimsBatchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
