import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCaseManagerComponent } from './assign-case-manager.component';

describe('AssignCaseManagerComponent', () => {
  let component: AssignCaseManagerComponent;
  let fixture: ComponentFixture<AssignCaseManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignCaseManagerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignCaseManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
