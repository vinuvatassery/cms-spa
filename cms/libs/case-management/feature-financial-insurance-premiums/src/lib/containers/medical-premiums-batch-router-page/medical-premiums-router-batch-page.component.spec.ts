import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsBatchRouterPageComponent } from './medical-premiums-router-batch-page.component';

describe('MedicalPremiumsBatchRouterPageComponent', () => {
  let component: MedicalPremiumsBatchRouterPageComponent;
  let fixture: ComponentFixture<MedicalPremiumsBatchRouterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumsBatchRouterPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsBatchRouterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
