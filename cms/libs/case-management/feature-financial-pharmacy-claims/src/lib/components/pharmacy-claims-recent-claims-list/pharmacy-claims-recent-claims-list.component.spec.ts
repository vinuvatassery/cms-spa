import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyClaimsRecentClaimsListComponent } from './pharmacy-claims-recent-claims-list.component';

describe('PharmacyClaimsRecentClaimsListComponent', () => {
  let component: PharmacyClaimsRecentClaimsListComponent;
  let fixture: ComponentFixture<PharmacyClaimsRecentClaimsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyClaimsRecentClaimsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyClaimsRecentClaimsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
