import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsLeavePageComponent } from './medical-premiums-leave-page.component';

describe('MedicalPremiumsLeavePageComponent', () => {
  let component: MedicalPremiumsLeavePageComponent;
  let fixture: ComponentFixture<MedicalPremiumsLeavePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumsLeavePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsLeavePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
