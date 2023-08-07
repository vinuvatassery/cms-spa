import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyClaimsBatchesLogListsComponent } from './pharmacy-claims-batches-log-lists.component';

describe('PharmacyClaimsBatchesLogListsComponent', () => {
  let component: PharmacyClaimsBatchesLogListsComponent;
  let fixture: ComponentFixture<PharmacyClaimsBatchesLogListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PharmacyClaimsBatchesLogListsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyClaimsBatchesLogListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
