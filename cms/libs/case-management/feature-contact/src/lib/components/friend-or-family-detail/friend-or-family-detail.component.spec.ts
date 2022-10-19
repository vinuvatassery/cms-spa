import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendOrFamilyDetailComponent } from './friend-or-family-detail.component';

describe('FriendOrFamilyDetailComponent', () => {
  let component: FriendOrFamilyDetailComponent;
  let fixture: ComponentFixture<FriendOrFamilyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FriendOrFamilyDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendOrFamilyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
