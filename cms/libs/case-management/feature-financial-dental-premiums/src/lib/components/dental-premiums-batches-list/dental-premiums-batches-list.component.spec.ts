import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsBatchesListComponent } from './dental-premiums-batches-list.component';

describe('DentalPremiumsBatchesListComponent', () => {
  let component: DentalPremiumsBatchesListComponent;
  let fixture: ComponentFixture<DentalPremiumsBatchesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalPremiumsBatchesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsBatchesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
