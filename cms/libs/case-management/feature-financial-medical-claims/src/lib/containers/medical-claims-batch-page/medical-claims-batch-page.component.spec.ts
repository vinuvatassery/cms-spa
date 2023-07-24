import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsBatchPageComponent } from '../medical-claims-batch-page.component;

describe('MedicalClaimsBatchPageComponent', () => {
  let component: MedicalClaimsBatchPageComponent;
  let fixture: ComponentFixture<MedicalClaimsBatchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalClaimsBatchPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsBatchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
