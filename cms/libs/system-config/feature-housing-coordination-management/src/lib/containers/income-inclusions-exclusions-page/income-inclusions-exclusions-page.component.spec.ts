import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncomeInclusionsExclusionsPageComponent } from './income-inclusions-exclusions-page.component';

describe('IncomeInclusionsExclusionsPageComponent', () => {
  let component: IncomeInclusionsExclusionsPageComponent;
  let fixture: ComponentFixture<IncomeInclusionsExclusionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncomeInclusionsExclusionsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IncomeInclusionsExclusionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
