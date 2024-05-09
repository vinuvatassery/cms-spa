/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { LovFacade, UserManagementFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-user-detail',
  templateUrl: './user-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailComponent implements OnInit {
  @Input() isEditValue!: boolean;
  @Output() isDeactivatePopupOpened = new EventEmitter();
  ddlUserRole$ = this.userManagementFacade.ddlUserRole$;
  userAccessTypeLov$ = this.lovFacade.userAccessTypeLov$;
  userRoleTypeCode$ = this.lovFacade.userRoleTypeLov$;
  caseManagerDomainLov$ = this.lovFacade.caseManagerDomainLov$;
  isDeactivateValue!: boolean;
  userAccessTypeLovData: any = null;
  userRoleTypeCodeLovData: any = null;
  isCaseManagerSelected = false;
  isAccessTypeInternal = false;

  public formUiStyle: UIFormStyle = new UIFormStyle();
  constructor(
    private userManagementFacade: UserManagementFacade,
    private lovFacade: LovFacade
  ) {}

  ngOnInit(): void {
    this.loadDdlUserRole();
    this.subscribeLovData();
    this.lovFacade.getUserAccessTypeLov();
    this.lovFacade.getRoleTypeLov();
    this.lovFacade.getCaseManagerDomainLov();
  }

  private loadDdlUserRole() {
    this.userManagementFacade.loadDdlUserRole();
  }

  onDeactivateClicked() {
    this.isDeactivatePopupOpened.emit();
    this.isDeactivateValue = true;
  }

  subscribeLovData() {
    this.userAccessTypeLov$.subscribe({
      next: (data) => {
        this.userAccessTypeLovData = data;
      },
      error: (err) => {},
    });

    this.userRoleTypeCode$.subscribe({
      next: (data) => {
        this.userRoleTypeCodeLovData = data;
      },
      error: (err) => {},
    });
  }

  onRoleValuechange(role: any) {
    if (role.roleCode == 'CACM') {
      this.isCaseManagerSelected = true;
    } else {
      this.isCaseManagerSelected = false;
    }
  }

  onUserAccessValueChange(userAccess: any){
    if(userAccess.lovCode == 'INTERNAL'){
      this.isAccessTypeInternal = true;
    }else{
      this.isAccessTypeInternal = false;
    }
  }
}
