import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncomeTypesPageComponent } from './income-types-page.component';

describe('IncomeTypesPageComponent', () => {
  let component: IncomeTypesPageComponent;
  let fixture: ComponentFixture<IncomeTypesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncomeTypesPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IncomeTypesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
