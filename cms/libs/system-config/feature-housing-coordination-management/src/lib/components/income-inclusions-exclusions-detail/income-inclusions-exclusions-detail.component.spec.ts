import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeInclusionsExclusionsDetailComponent } from './income-inclusions-exclusions-detail.component';

describe('IncomeInclusionsExclusionsDetailComponent', () => {
  let component: IncomeInclusionsExclusionsDetailComponent;
  let fixture: ComponentFixture<IncomeInclusionsExclusionsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomeInclusionsExclusionsDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeInclusionsExclusionsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
