import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsRecentPremiumsListComponent } from './dental-premiums-recent-premiums-list.component';

describe('DentalPremiumsRecentPremiumsListComponent', () => {
  let component: DentalPremiumsRecentPremiumsListComponent;
  let fixture: ComponentFixture<DentalPremiumsRecentPremiumsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DentalPremiumsRecentPremiumsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsRecentPremiumsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
