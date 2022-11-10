/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { CerTrackingFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
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
  public formUiStyle : UIFormStyle = new UIFormStyle();
  // actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType: "btn-h-primary",
      text: "Send CER Reminders",
      // icon: "done",
      click: (): void => {
        // this.onDoneClicked();
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "Send Restricted Notices",
      // icon: "edit",
      click: (): void => {
      //  this.onOpenTodoDetailsClicked()
      },
    },
   
    
 
  ];

  /** Constructor**/
  constructor(private readonly cerTrackingFacade: CerTrackingFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadCerGrid();
    this.loadDdlcer();
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
