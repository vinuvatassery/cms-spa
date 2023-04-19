import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCellDateRangeFilterComponent } from './grid-cell-date-range-filter.component';

describe('GridCellDateRangeFilterComponent', () => {
  let component: GridCellDateRangeFilterComponent;
  let fixture: ComponentFixture<GridCellDateRangeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GridCellDateRangeFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GridCellDateRangeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
