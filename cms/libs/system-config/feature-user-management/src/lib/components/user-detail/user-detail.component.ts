/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { LovFacade, UserAccessType, UserManagementFacade } from '@cms/system-config/domain';
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
  activeFlag = 'Y';
  userAccessType: any;
  userRoleType: string = "";
  userRolesList = [];

  public formUiStyle: UIFormStyle = new UIFormStyle();
  constructor(
    private userManagementFacade: UserManagementFacade,
    private lovFacade: LovFacade
  ) {}

  ngOnInit(): void {
    this.subscribeLovData();
    this.lovFacade.getUserAccessTypeLov();
    this.lovFacade.getRoleTypeLov();
    this.lovFacade.getCaseManagerDomainLov();
  }

  private loadDdlUserRole() {    
    if(this.userRoleType == "") return;
    this.userManagementFacade.loadDdlUserRole(this.userRoleType, this.activeFlag);
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

    this.ddlUserRole$.subscribe({
      next: (data) => {
        this.userRolesList = data;
      },
      error: (err) => {}
    })
  }

  onUserAccessValueChange(event: Event){
    let value = (event.target as HTMLInputElement).value.toUpperCase();
    if(value == UserAccessType.Internal){
      this.isAccessTypeInternal = true;
    }else{
      this.isAccessTypeInternal = false;
    }
    this.userRoleType = this.getUserRoleType(value);
    this.loadDdlUserRole();
  }

  getUserRoleType(userType: any){
    switch(userType){
      case UserAccessType.Internal:
        return UserAccessType.Internal;
      case UserAccessType.External:
        return UserAccessType.External;
    }
    return "";
  }

}
