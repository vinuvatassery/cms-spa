/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { UserManagementFacade } from '@cms/system-config/domain';

@Component({
  selector: 'system-config-router-page',
  templateUrl: './system-config-router-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemConfigRouterPageComponent {
  /** Public properties **/
  users$ = this.userManagementFacade.users$;
  isInnerLeftMenuOpen = false;
  /** Constructor **/
  constructor(private readonly userManagementFacade: UserManagementFacade) { }


  openInnerLeftMenu(){
    this.isInnerLeftMenuOpen = !this.isInnerLeftMenuOpen
  }
}
