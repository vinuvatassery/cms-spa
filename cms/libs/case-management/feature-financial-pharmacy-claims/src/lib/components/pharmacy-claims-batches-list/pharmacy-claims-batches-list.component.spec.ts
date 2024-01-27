import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyClaimsBatchesListComponent } from './pharmacy-claims-batches-list.component';

describe('PharmacyClaimsBatchesListComponent', () => {
  let component: PharmacyClaimsBatchesListComponent;
  let fixture: ComponentFixture<PharmacyClaimsBatchesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PharmacyClaimsBatchesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyClaimsBatchesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
