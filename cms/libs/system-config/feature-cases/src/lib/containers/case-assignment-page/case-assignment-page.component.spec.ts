import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseAssignmentPageComponent } from './case-assignment-page.component';

describe('CaseAssignmentPageComponent', () => {
  let component: CaseAssignmentPageComponent;
  let fixture: ComponentFixture<CaseAssignmentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaseAssignmentPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaseAssignmentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
