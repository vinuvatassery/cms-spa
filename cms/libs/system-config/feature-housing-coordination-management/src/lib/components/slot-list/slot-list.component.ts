import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-slot-list',
  templateUrl: './slot-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlotListComponent implements OnInit {

  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  /** Public properties **/
  isSlotDetailPopup = false;
  ddlColumnFilters$ = this.userManagementFacade.ddlColumnFilters$;
  clientProfileSlots$ = this.userManagementFacade.clientProfileSlots$;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public moreactions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
      click: (): void => {
        this.onSlotDetailClicked();
      },
    }, 
 
  ];

  /** Constructor **/
  constructor(private readonly userManagementFacade: UserManagementFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlColumnFilters();
    this.loadClientProfileSlots();
  }

  /** Private methods **/
  private loadDdlColumnFilters() {
    this.userManagementFacade.loadDdlColumnFilters();
  }

  private loadClientProfileSlots() {
    this.userManagementFacade.loadClientProfileSlots();
  }

  /** Internal event methods **/
  onCloseSlotDetailClicked() {
    this.isSlotDetailPopup = false;
  }
  onSlotDetailClicked() {
    this.isSlotDetailPopup = true;
  }
}
