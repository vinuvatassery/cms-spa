/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { CerTrackingFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import { State } from '@progress/kendo-data-query';
@Component({
  selector: 'case-management-cer-list',
  templateUrl: './cer-list.component.html',
  styleUrls: ['./cer-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CerListComponent implements OnInit {
  /** Public properties **/
  cerGrid$ = this.cerTrackingFacade.cerGrid$;
  ddlCer$ = this.cerTrackingFacade.ddlCer$;
  isOpenSendCER = false;
  todayDate= new Date();
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public isGridLoaderShow = false;
public sortValue = this.cerTrackingFacade.sortValue;
public sortType = this.cerTrackingFacade.sortType;
public pageSizes = this.cerTrackingFacade.gridPageSizes;
public gridSkipCount = this.cerTrackingFacade.skipCount;
public sort = this.cerTrackingFacade.sort;
public state!: State;
  // actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType: "btn-h-primary",
      text: "Send CER Reminders",
      // icon: "done",
      click: (): void => {
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "Send Restricted Notices",
      // icon: "edit",
      click: (): void => {
      },
    },
   
    
 
  ];

  /** Constructor**/
  constructor(private readonly cerTrackingFacade: CerTrackingFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadCerGrid();
    this.loadDdlcer();
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
 
  }
  ngOnChanges(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
 
  }
  /** Private methods **/
  private loadCerGrid() {
    this.cerTrackingFacade.loadCerGrid();
  }

  private loadDdlcer() {
    this.cerTrackingFacade.loadDdlCer();
  }

  /** Internal event methods **/
  onCloseSendCERClicked() {
    this.isOpenSendCER = false;
  }

  onOpenSendCERClicked() {
    this.isOpenSendCER = true;
  }
}
