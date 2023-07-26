import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsRecentClaimsListComponent } from './medical-premiums-recent-claims-list.component';

describe('MedicalPremiumsRecentClaimsListComponent', () => {
  let component: MedicalPremiumsRecentClaimsListComponent;
  let fixture: ComponentFixture<MedicalPremiumsRecentClaimsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalPremiumsRecentClaimsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsRecentClaimsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
