import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsBatchItemsPageComponent } from './medical-premiums-batch-items-page.component';

describe('MedicalPremiumsBatchItemsPageComponent', () => {
  let component: MedicalPremiumsBatchItemsPageComponent;
  let fixture: ComponentFixture<MedicalPremiumsBatchItemsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumsBatchItemsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsBatchItemsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
