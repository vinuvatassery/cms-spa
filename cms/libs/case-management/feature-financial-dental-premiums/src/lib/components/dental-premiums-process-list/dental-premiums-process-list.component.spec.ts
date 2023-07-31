import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsProcessListComponent } from './dental-premiums-process-list.component';

describe('DentalPremiumsProcessListComponent', () => {
  let component: DentalPremiumsProcessListComponent;
  let fixture: ComponentFixture<DentalPremiumsProcessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalPremiumsProcessListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsProcessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
