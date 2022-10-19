import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReAssignCaseManagerComponent } from './re-assign-case-manager.component';

describe('ReAssignCaseManagerComponent', () => {
  let component: ReAssignCaseManagerComponent;
  let fixture: ComponentFixture<ReAssignCaseManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReAssignCaseManagerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReAssignCaseManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
