import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsBatchesLogListsComponent } from './medical-premiums-batches-log-lists.component';

describe('MedicalPremiumsBatchesLogListsComponent', () => {
  let component: MedicalPremiumsBatchesLogListsComponent;
  let fixture: ComponentFixture<MedicalPremiumsBatchesLogListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumsBatchesLogListsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsBatchesLogListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
