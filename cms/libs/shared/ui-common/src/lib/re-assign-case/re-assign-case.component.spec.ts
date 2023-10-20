import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReAssignCaseComponent } from './re-assign-case.component';

describe('ReAssignCaseComponent', () => {
  let component: ReAssignCaseComponent;
  let fixture: ComponentFixture<ReAssignCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReAssignCaseComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReAssignCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
