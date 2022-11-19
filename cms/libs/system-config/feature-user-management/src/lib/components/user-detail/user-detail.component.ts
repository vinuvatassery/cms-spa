/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailComponent implements OnInit {
  @Input() isEditValue!: boolean;
  @Output() isDeactivatePopupOpened = new EventEmitter();
  ddlUserRole$ = this.userManagementFacade.ddlUserRole$;
  isDeactivateValue !: boolean;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  constructor(private userManagementFacade: UserManagementFacade) { }

  ngOnInit(): void {
    this.loadDdlUserRole();
  }

  private loadDdlUserRole() {
    this.userManagementFacade.loadDdlUserRole();
  }

  onDeactivateClicked() {
    this.isDeactivatePopupOpened.emit();
    this.isDeactivateValue = true;
  }
}
