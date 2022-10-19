/** Angular **/
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
/** Facades **/
import { UserManagementFacade } from '@cms/system-config/domain';

@Component({
  selector: 'system-config-slot-list',
  templateUrl: './slot-list.component.html',
  styleUrls: ['./slot-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlotListComponent implements OnInit {
  /** Public properties **/
  isSlotDetailPopup = false;
  ddlColumnFilters$ = this.userManagementFacade.ddlColumnFilters$;
  clientProfileSlots$ = this.userManagementFacade.clientProfileSlots$;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';

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
