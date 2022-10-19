import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumListComponent } from './medical-premium-list.component';

describe('MedicalPremiumListComponent', () => {
  let component: MedicalPremiumListComponent;
  let fixture: ComponentFixture<MedicalPremiumListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalPremiumListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
