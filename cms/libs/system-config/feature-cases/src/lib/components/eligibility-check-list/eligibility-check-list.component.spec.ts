import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EligibilityCheckListComponent } from './eligibility-check-list.component';

describe('EligibilityCheckListComponent', () => {
  let component: EligibilityCheckListComponent;
  let fixture: ComponentFixture<EligibilityCheckListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EligibilityCheckListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EligibilityCheckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
