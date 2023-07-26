import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalClaimsBatchesLogListsComponent } from './dental-claims-batches-log-lists.component';

describe('DentalClaimsBatchesLogListsComponent', () => {
  let component: DentalClaimsBatchesLogListsComponent;
  let fixture: ComponentFixture<DentalClaimsBatchesLogListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalClaimsBatchesLogListsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalClaimsBatchesLogListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
