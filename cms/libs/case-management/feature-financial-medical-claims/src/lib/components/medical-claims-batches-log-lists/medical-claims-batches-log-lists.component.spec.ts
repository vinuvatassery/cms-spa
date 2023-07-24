import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsBatchesLogListsComponent } from './medical-claims-batches-log-lists.component';

describe('MedicalClaimsBatchesLogListsComponent', () => {
  let component: MedicalClaimsBatchesLogListsComponent;
  let fixture: ComponentFixture<MedicalClaimsBatchesLogListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalClaimsBatchesLogListsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsBatchesLogListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
