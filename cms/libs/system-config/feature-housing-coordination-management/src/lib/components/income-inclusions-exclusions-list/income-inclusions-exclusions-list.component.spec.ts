import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeInclusionsExclusionsListComponent } from './income-inclusions-exclusions-list.component';

describe('IncomeInclusionsExclusionsListComponent', () => {
  let component: IncomeInclusionsExclusionsListComponent;
  let fixture: ComponentFixture<IncomeInclusionsExclusionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomeInclusionsExclusionsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeInclusionsExclusionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
