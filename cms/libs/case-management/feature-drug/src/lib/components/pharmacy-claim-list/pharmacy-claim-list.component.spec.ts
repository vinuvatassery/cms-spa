import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyClaimListComponent } from './pharmacy-claim-list.component';

describe('PharmacyClaimListComponent', () => {
  let component: PharmacyClaimListComponent;
  let fixture: ComponentFixture<PharmacyClaimListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PharmacyClaimListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyClaimListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
