/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { UserManagementFacade } from '@cms/system-config/domain';

@Component({
  selector: 'system-config-user-management-page',
  templateUrl: './user-management-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementPageComponent implements OnInit {
  /** Public properties **/
  users$ = this.userManagementFacade.users$;
  isInnerLeftMenuOpen = false;
  /** Constructor **/
  constructor(private readonly userManagementFacade: UserManagementFacade) { }

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadUsers();
  }

  /** Public methods **/
  loadUsers(): void {
    this.userManagementFacade.loadUsers();
  }
  openInnerLeftMenu(){
    this.isInnerLeftMenuOpen = !this.isInnerLeftMenuOpen
  }
}
