import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendOrFamilyListComponent } from './friend-or-family-list.component';

describe('FriendOrFamilyListComponent', () => {
  let component: FriendOrFamilyListComponent;
  let fixture: ComponentFixture<FriendOrFamilyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FriendOrFamilyListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendOrFamilyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
