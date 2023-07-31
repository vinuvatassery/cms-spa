import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsBatchesListComponent } from './medical-claims-batches-list.component';

describe('MedicalClaimsBatchesListComponent', () => {
  let component: MedicalClaimsBatchesListComponent;
  let fixture: ComponentFixture<MedicalClaimsBatchesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalClaimsBatchesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsBatchesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
