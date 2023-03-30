/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DeleteFriendOrFamilyConfirmationComponent } from './delete-friend-or-family-confirmation.component';

describe('DeleteFriendOrFamilyConfirmationComponent', () => {
  let component: DeleteFriendOrFamilyConfirmationComponent;
  let fixture: ComponentFixture<DeleteFriendOrFamilyConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteFriendOrFamilyConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteFriendOrFamilyConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
