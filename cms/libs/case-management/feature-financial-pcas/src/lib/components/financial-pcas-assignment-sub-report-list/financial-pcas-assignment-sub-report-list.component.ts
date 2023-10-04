/** Angular **/
import {
  ChangeDetectionStrategy, Component, EventEmitter, Input,
  OnChanges, Output,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { FinancialPcaFacade } from '@cms/case-management/domain';
@Component({
  selector: 'cms-financial-pcas-assignment-sub-report-list',
  templateUrl: './financial-pcas-assignment-sub-report-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPcasAssignmentSubReportListComponent implements OnChanges {

  @Input() pageSizes: any;
  @Input() objectId: any;
  @Input() groupId: any;
  sort: any = "priority";
  isFinancialPcaSubReportGridLoaderShow = false;
  gridFinancialPcaSubReportDataSubject = new Subject<any>();
  gridFinancialPcaReportData$ = this.gridFinancialPcaSubReportDataSubject.asObservable();
  financialPcaSubReportGridLists$ = new Subject<any>();
  public state!: State;
  sortType = "asc"
  gridDataResult!: GridDataResult;
  public formUiStyle: UIFormStyle = new UIFormStyle();

  constructor(
    private readonly financialPcaFacade: FinancialPcaFacade
  ) { }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadPcasAssignmentSubGrid();
  }

  loadPcasAssignmentSubReport(data:any) {
    this.financialPcaFacade.loadFinancialPcaSubReportListGrid(data).subscribe({
      next: (dataResponse:any) => {
        const gridView = {
          data: dataResponse['items'],
          total: dataResponse['totalCount'],
        };
        this.financialPcaSubReportGridLists$.next(gridView);
      },
      error: (err:any) => {
      },
    });
    this.gridDataHandle();
    this.gridDataHandle();
  }

  gridDataHandle() {
    this.financialPcaSubReportGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridFinancialPcaSubReportDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isFinancialPcaSubReportGridLoaderShow = false;
      }
    });
  }

  loadPcasAssignmentSubGrid() {
    this.loadPcasAssignmentSubReport({
      objectId          :this.objectId,
      groupId          :this.groupId,
      skipCount         :this.state?.skip ?? 0,
      maxResultCount    :this.state?.take ?? 0,
      sortColumn        :this.sort,
      sortType          :this.sortType
    });
  }

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadPcasAssignmentSubGrid();
  }

  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;    
    this.loadPcasAssignmentSubGrid();
  }

  onChange(data: any) {
    this.defaultGridState();
    const stateData = this.state;
    this.dataStateChange(stateData);
  }

  defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter: { logic: 'and', filters: [] },
    };
  }  
}