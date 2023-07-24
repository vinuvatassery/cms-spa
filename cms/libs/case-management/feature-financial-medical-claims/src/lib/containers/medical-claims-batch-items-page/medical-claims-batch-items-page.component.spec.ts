import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsBatchItemsPageComponent } from './medical-claims-batch-items-page.component';

describe('MedicalClaimsBatchItemsPageComponent', () => {
  let component: MedicalClaimsBatchItemsPageComponent;
  let fixture: ComponentFixture<MedicalClaimsBatchItemsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalClaimsBatchItemsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsBatchItemsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
