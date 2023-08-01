import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsBatchListDetailItemsComponent } from './medical-premiums-batch-list-detail-items.component';

describe('MedicalPremiumsBatchListDetailItemsComponent', () => {
  let component: MedicalPremiumsBatchListDetailItemsComponent;
  let fixture: ComponentFixture<MedicalPremiumsBatchListDetailItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalPremiumsBatchListDetailItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      MedicalPremiumsBatchListDetailItemsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
