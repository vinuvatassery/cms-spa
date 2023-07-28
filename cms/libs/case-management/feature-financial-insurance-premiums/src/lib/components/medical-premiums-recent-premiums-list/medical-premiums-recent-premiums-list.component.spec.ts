import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsRecentPremiumsListComponent } from './medical-premiums-recent-premiums-list.component';

describe('MedicalPremiumsRecentPremiumsListComponent', () => {
  let component: MedicalPremiumsRecentPremiumsListComponent;
  let fixture: ComponentFixture<MedicalPremiumsRecentPremiumsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalPremiumsRecentPremiumsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsRecentPremiumsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
