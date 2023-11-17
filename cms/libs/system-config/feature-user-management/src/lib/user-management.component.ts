import { Component, OnInit } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';

@Component({
  selector: 'system-config-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  userList$ = this.userManagementFacade.userList$;

  constructor(private userManagementFacade: UserManagementFacade) {}

  ngOnInit() {
    this.load();
  }

  load(): void {
    this.userManagementFacade.load();
  }
}
