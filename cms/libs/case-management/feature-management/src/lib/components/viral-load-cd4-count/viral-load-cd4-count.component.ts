/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges } from '@angular/core';
/** Facades **/
import { ManagementFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';

@Component({
  selector: 'case-management-viral-load-cd4-count',
  templateUrl: './viral-load-cd4-count.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViralLoadCD4CountComponent implements OnChanges {

     /** Public properties **/
     loadViralLoad$ = this.providerFacade.loadViralLoad$;
     @Input() labResultType: any;
     @Input() pageSizes: any;
     @Input() sortValue: any;
     @Input() sortType: any;
     @Input() sort: any;
     @Input() clientLabResults$ : any;
     @Output() loadClientLabresListEvent = new EventEmitter<any>();

     gridDataSubject = new Subject<any>();
     gridData$ = this.gridDataSubject.asObservable();

     public formUiStyle : UIFormStyle = new UIFormStyle();
     public state!: State;
     loader = false
     historychkBoxChecked = false;
     /** Constructor **/
     constructor(private readonly providerFacade: ManagementFacade) {}
   
     /** Lifecycle hooks **/
     ngOnChanges(): void {
      this.state = {
        skip: 0,
        take: this.pageSizes[0]?.value,
        sort: this.sort,
      };
      this.loadClientLabResultList();
    }
    pageselectionchange(data: any) {
      this.state.take = data.value;
      this.state.skip = 0;
      this.loadClientLabResultList();
    }
  
    /** Private methods **/
    private loadClientLabResultList(): void {
      this.gridDataHandle();
      this.loadLabResults(
        this.state.skip ?? 0,
        this.state.take ?? 0,
        this.sortValue,
        this.sortType  ,
        false      
      );
    }
    loadLabResults(
      skipcountValue: number,
      maxResultCountValue: number,
      sortValue: string,
      sortTypeValue: string ,
      historychkBoxChecked : boolean   
    ) {
      const gridDataRefinerValue = {
        skipCount: skipcountValue,
        pagesize: maxResultCountValue,
        sortColumn: sortValue,
        sortType: sortTypeValue ,
        historychkBoxChecked : historychkBoxChecked     
      };
      this.loader = true;
      this.loadClientLabresListEvent.next(gridDataRefinerValue);
    }
  
    /** grid event methods **/
  
    public dataStateChange(stateData: any): void {
      this.sort = stateData.sort;
      this.sortValue = stateData.sort[0]?.field;
      this.sortType = stateData.sort[0]?.dir ?? 'asc';
      this.state = stateData;
      this.loadClientLabResultList();
    }
  
    gridDataHandle() {
      this.clientLabResults$.subscribe((data: any) => {
        this.gridDataSubject.next(data);
        if (data?.total >= 0 || data?.total === -1) {
          this.loader = false;
        }
      });
    }  
    onhistorychkBoxChanged() {
      this.historychkBoxChecked = !this.historychkBoxChecked;
      this.loadLabResults(
        this.state.skip ?? 0,
        this.state.take ?? 0,
        this.sortValue,
        this.sortType,
        this.historychkBoxChecked
      );
    }
   
}
