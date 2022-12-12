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
 
@Component({
  selector: 'case-management-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseListComponent implements OnInit {

public isGridLoaderShow = false;
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
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
