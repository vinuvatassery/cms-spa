import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsProcessListComponent } from './medical-premiums-process-list.component';

describe('MedicalPremiumsProcessListComponent', () => {
  let component: MedicalPremiumsProcessListComponent;
  let fixture: ComponentFixture<MedicalPremiumsProcessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumsProcessListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsProcessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
