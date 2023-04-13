import { Component, Input, OnInit, OnDestroy, ElementRef } from "@angular/core";
import {
  BaseFilterCellComponent,
  FilterService,
  PopupCloseEvent,
  SinglePopupService,
} from "@progress/kendo-angular-grid";
import { CompositeFilterDescriptor, FilterDescriptor } from "@progress/kendo-data-query";
import { PopupSettings } from "@progress/kendo-angular-dateinputs";
import { addDays } from "@progress/kendo-date-math";
import { Subscription } from "rxjs";

const closest = (
  node: HTMLElement,
  predicate: (node: HTMLElement) => boolean
): HTMLElement => {
  while (node && !predicate(node)) {
    node = node.parentNode as HTMLElement;
  }

  return node;
};
@Component({
  selector: 'common-grid-cell-date-range-filter',
  templateUrl: './grid-cell-date-range-filter.component.html',
  styleUrls: ['./grid-cell-date-range-filter.component.scss'],
})

export class GridCellDateRangeFilterComponent implements OnInit, OnDestroy {

  @Input() public filter!: CompositeFilterDescriptor;
  @Input() public filterService!: FilterService;
  @Input() public field!: string;

  public start!: Date;
  public end!: Date;

  public get min(): any {
    return this.start ? addDays(this.start, 1) : null;
  }

  public get max(): any {
    return this.end ? addDays(this.end, -1) : null;
  }

  public popupSettings: PopupSettings = {
    popupClass: "date-range-filter",
  };

  private popupSubscription: Subscription;

  constructor(
    private element: ElementRef,
    private popupService: SinglePopupService
  ) {
    this.popupSubscription = popupService.onClose.subscribe(
      (e: PopupCloseEvent) => {
        if (
          document.activeElement &&
          closest(
            document.activeElement as HTMLElement,
            (node) =>
              node === this.element.nativeElement ||
              String(node.className).indexOf("date-range-filter") >= 0
          )
        ) {
          e.preventDefault();
        }
      }
    );
  }

  public ngOnInit(): void {
    this.start = this.findValue("gte");
    this.end = this.findValue("lte");
  }

  public ngOnDestroy(): void {
    this.popupSubscription.unsubscribe();
  }

  public onStartChange(value: Date): void {
    this.filterRange(value, this.end);
  }

  public onEndChange(value: Date): void {
    this.filterRange(this.start, value);
  }

  private findValue(operator:any) {
    const filter = this.filter.filters.filter(
      (x) =>
        (x as FilterDescriptor).field === this.field &&
        (x as FilterDescriptor).operator === operator
    )[0];
    return filter ? (filter as FilterDescriptor).value : null;
  }

  private filterRange(start:any, end:any) {
    const filters = [];

    if (start && (!end || start < end)) {
      filters.push({
        field: this.field,
        operator: "gte",
        value: start,
      });
      this.start = start;
    }

    if (end && (!start || start < end)) {
      filters.push({
        field: this.field,
        operator: "lte",
        value: end,
      });
      this.end = end;
    }

    this.filterService.filter({
      logic: "and",
      filters: filters,
    });
  }
}
