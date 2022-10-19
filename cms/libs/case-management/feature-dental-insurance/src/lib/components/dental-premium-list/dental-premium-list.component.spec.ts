import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumListComponent } from './dental-premium-list.component';

describe('DentalPremiumListComponent', () => {
  let component: DentalPremiumListComponent;
  let fixture: ComponentFixture<DentalPremiumListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalPremiumListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DentalPremiumListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
