import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnAssignCaseManagerComponent } from './un-assign-case-manager.component';

describe('UnAssignCaseManagerComponent', () => {
  let component: UnAssignCaseManagerComponent;
  let fixture: ComponentFixture<UnAssignCaseManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnAssignCaseManagerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnAssignCaseManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
