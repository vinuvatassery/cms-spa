/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
@Component({
  selector: 'system-config-deactivate-user-confirmation',
  templateUrl: './deactivate-user-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeactivateUserConfirmationComponent {
  @Input() userId: any;
  @Input() status: any;
  @Output() closeDeactivateUsers = new EventEmitter();

  /** Constructor **/ 
  constructor(
    private readonly userManagementFacade: UserManagementFacade)
    {

    }

    onDialougeClose(){
      this.closeDeactivateUsers.emit();
    }
    onDeactivateClick()
    {
      const userData={
        userId: this.userId,
        activeFlag: this.status
      };
      this.userManagementFacade.deactivateUser(userData);
    }
}




