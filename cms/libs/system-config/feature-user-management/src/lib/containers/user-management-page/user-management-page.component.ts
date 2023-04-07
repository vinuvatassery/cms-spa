/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { UserManagementFacade } from '@cms/system-config/domain';

@Component({
  selector: 'system-config-user-management-page',
  templateUrl: './user-management-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementPageComponent {
  /** Public properties **/
  users$ = this.userManagementFacade.users$;
  isInnerLeftMenuOpen = false;
  /** Constructor **/
  constructor(private readonly userManagementFacade: UserManagementFacade) { }


  openInnerLeftMenu(){
    this.isInnerLeftMenuOpen = !this.isInnerLeftMenuOpen
  }
}
