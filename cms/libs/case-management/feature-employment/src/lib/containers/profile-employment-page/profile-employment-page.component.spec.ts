import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEmploymentPageComponent } from './profile-employment-page.component';

describe('ProfileEmploymentPageComponent', () => {
  let component: ProfileEmploymentPageComponent;
  let fixture: ComponentFixture<ProfileEmploymentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileEmploymentPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileEmploymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
