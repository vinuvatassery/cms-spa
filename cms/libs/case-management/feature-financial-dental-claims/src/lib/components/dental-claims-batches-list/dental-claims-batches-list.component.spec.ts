import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalClaimsBatchesListComponent } from './dental-claims-batches-list.component';

describe('DentalClaimsBatchesListComponent', () => {
  let component: DentalClaimsBatchesListComponent;
  let fixture: ComponentFixture<DentalClaimsBatchesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalClaimsBatchesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalClaimsBatchesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
