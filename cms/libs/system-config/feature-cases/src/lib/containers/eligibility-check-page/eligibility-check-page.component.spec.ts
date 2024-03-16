import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EligibilityCheckPageComponent } from './eligibility-check-page.component';

describe('EligibilityCheckPageComponent', () => {
  let component: EligibilityCheckPageComponent;
  let fixture: ComponentFixture<EligibilityCheckPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EligibilityCheckPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EligibilityCheckPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
