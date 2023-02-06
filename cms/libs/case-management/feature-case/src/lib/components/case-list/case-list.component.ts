/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
/** Facades **/
import { CaseFacade } from '@cms/case-management/domain';
 
import { UIFormStyle } from '@cms/shared/ui-tpa' 
import { State } from '@progress/kendo-data-query';
@Component({
  selector: 'case-management-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseListComponent implements OnInit, OnChanges {

public isGridLoaderShow = false;


public state!: State;
  /*** Input properties ***/
  @Input() cases: any;
  @Input() pageSizes : any;
  @Input() sortValue : any;
  @Input() sortType : any;
  @Input() sort : any;
 
  /** Public properties **/
  ddlGridColumns$ = this.caseFacade.ddlGridColumns$;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  @Output() loadCasesListEvent = new EventEmitter<any>(); 
 
  /** Constructor**/
  constructor(private readonly caseFacade: CaseFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlGridColumns();
  }
  ngOnChanges(): void {    
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort
      };        
    this.loadProfileCasesList() 
  }

  pageselectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadProfileCasesList()
  }
  public dataStateChange(stateData: any): void {         
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field
    this.sortType = stateData.sort[0]?.dir ?? 'asc'
    this.state=stateData;
    this.loadProfileCasesList();   
}
  private loadProfileCasesList(): void {   
    this.loadCases(this.state.skip ?? 0 ,this.state.take ?? 0,this.sortValue , this.sortType)    
  }
   loadCases(skipcountValue : number,maxResultCountValue : number ,sortValue : string , sortTypeValue : string)
   {
     const gridDataRefinerValue = 
     {
       skipCount: skipcountValue,
       pagesize : maxResultCountValue,
       sortColumn : sortValue,
       sortType : sortTypeValue,
     }
     this.loadCasesListEvent.next(gridDataRefinerValue)
   }

  /** Private methods **/
  private loadDdlGridColumns() {
    this.isGridLoaderShow = true;
    this.caseFacade.loadDdlGridColumns();
    this.isGridLoaderShow = false;

  }
}
