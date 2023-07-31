import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsBatchesLogListsComponent } from './dental-premiums-batches-log-lists.component';

describe('DentalPremiumsBatchesLogListsComponent', () => {
  let component: DentalPremiumsBatchesLogListsComponent;
  let fixture: ComponentFixture<DentalPremiumsBatchesLogListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalPremiumsBatchesLogListsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsBatchesLogListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
