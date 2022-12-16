/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
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
export class CaseListComponent implements OnInit {

public isGridLoaderShow = false;
public sortValue = this.caseFacade.sortValue;
public sortType = this.caseFacade.sortType;
public pageSizes = this.caseFacade.gridPageSizes;
public gridSkipCount = this.caseFacade.skipCount;
public sort = this.caseFacade.sort;
public state!: State;
  /*** Input properties ***/
  @Input() cases: any;
 
  /** Public properties **/
  ddlGridColumns$ = this.caseFacade.ddlGridColumns$;
  public formUiStyle : UIFormStyle = new UIFormStyle();
 
 
  /** Constructor**/
  constructor(private readonly caseFacade: CaseFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlGridColumns();
  }

  /** Private methods **/
  private loadDdlGridColumns() {
    this.isGridLoaderShow = true;
    this.caseFacade.loadDdlGridColumns();
    this.isGridLoaderShow = false;

  }
}
