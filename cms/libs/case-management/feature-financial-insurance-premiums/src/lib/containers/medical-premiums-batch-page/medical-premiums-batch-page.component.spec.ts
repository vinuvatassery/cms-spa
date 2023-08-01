import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsBatchPageComponent } from '../medical-premiums-batch-page.component;

describe('MedicalPremiumsBatchPageComponent', () => {
  let component: MedicalPremiumsBatchPageComponent;
  let fixture: ComponentFixture<MedicalPremiumsBatchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumsBatchPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsBatchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
