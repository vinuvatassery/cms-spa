import { Component, Input } from "@angular/core";
import {
  BaseFilterCellComponent,
  FilterService,
} from "@progress/kendo-angular-grid";
import { CompositeFilterDescriptor, FilterDescriptor } from "@progress/kendo-data-query";

@Component({
  selector: 'common-grid-cell-date-range-filter',
  templateUrl: './grid-cell-date-range-filter.component.html',
  styleUrls: ['./grid-cell-date-range-filter.component.scss'],
})

export class GridCellDateRangeFilterComponent extends BaseFilterCellComponent {

  //@Input() public filter: CompositeFilterDescriptor;

  @Input()
  public field!: string;

  constructor(filterService: FilterService) {
    super(filterService);
    //this.filter={logic:'and',filters:[]};
  }
  //public start:any;

  public get start(): Date {
    const first = this.findByOperator("gte");

    return (first || <FilterDescriptor>{}).value;
  }

  public get end(): Date {
    const end = this.findByOperator("lte");
    return (end || <FilterDescriptor>{}).value;
  }

  public get hasFilter(): boolean {
    return this.filtersByField(this.field).length > 0;
  }

  public clearFilter(): void {
    this.filterService.filter(this.removeFilter(this.field));
  }

  public filterRange(start: Date, end: Date): void {
   // this.filter = this.removeFilter(this.field);

    const filters = [];

    if (start) {
      filters.push({
        field: this.field,
        operator: "gte",
        value: start,
      });
    }

    if (end) {
      filters.push({
        field: this.field,
        operator: "lte",
        value: end,
      });
    }

    const root = this.filter || {
      logic: "and",
      filters: [],
    };

    if (filters.length) {
      root.filters.push(...filters);
    }

    //this.filterService.filter(root);
  }

  private findByOperator(op: string): FilterDescriptor {
    return this.filtersByField(this.field).filter(
      ({ operator }) => operator === op
    )[0];
  }
}
