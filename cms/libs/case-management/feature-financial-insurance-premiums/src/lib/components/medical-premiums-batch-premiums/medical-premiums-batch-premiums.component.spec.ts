import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsBatchPremiumsComponent } from './medical-premiums-batch-premiums.component';

describe('MedicalPremiumsBatchPremiumsComponent', () => {
  let component: MedicalPremiumsBatchPremiumsComponent;
  let fixture: ComponentFixture<MedicalPremiumsBatchPremiumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalPremiumsBatchPremiumsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsBatchPremiumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
