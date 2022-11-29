import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-roles-and-permissions-detail',
  templateUrl: './roles-and-permissions-detail.component.html',
  styleUrls: ['./roles-and-permissions-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesAndPermissionsDetailComponent implements OnInit {
  ddlRolePermission: Array<string> = ["No Access", "Access"];  
public formUiStyle : UIFormStyle = new UIFormStyle();
isInnerLeftMenuOpen = false;
  constructor() { }

  ngOnInit(): void {
  }
  openInnerLeftMenu(){
    this.isInnerLeftMenuOpen = !this.isInnerLeftMenuOpen
  }
}
