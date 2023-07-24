import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsRecentClaimsListComponent } from './medical-claims-recent-claims-list.component';

describe('MedicalClaimsRecentClaimsListComponent', () => {
  let component: MedicalClaimsRecentClaimsListComponent;
  let fixture: ComponentFixture<MedicalClaimsRecentClaimsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalClaimsRecentClaimsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsRecentClaimsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
