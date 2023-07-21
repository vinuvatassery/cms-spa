import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsBatchListDetailItemsComponent } from './medical-claims-batch-list-detail-items.component';

describe('MedicalClaimsBatchListDetailItemsComponent', () => {
  let component: MedicalClaimsBatchListDetailItemsComponent;
  let fixture: ComponentFixture<MedicalClaimsBatchListDetailItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalClaimsBatchListDetailItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      MedicalClaimsBatchListDetailItemsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
