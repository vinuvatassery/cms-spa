import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileIncomePageComponent } from './profile-income-page.component';

describe('ProfileIncomePageComponent', () => {
  let component: ProfileIncomePageComponent;
  let fixture: ComponentFixture<ProfileIncomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileIncomePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileIncomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
