import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsBatchesListComponent } from './medical-premiums-batches-list.component';

describe('MedicalPremiumsBatchesListComponent', () => {
  let component: MedicalPremiumsBatchesListComponent;
  let fixture: ComponentFixture<MedicalPremiumsBatchesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumsBatchesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsBatchesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
