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
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { group } from '@angular/animations';
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
  caseManagerAssistorGrp$ = this.lovFacade.caseManagerAssistorGrp$;
  isDeactivateValue!: boolean;
  userAccessTypeLovData: any = null;
  userRoleTypeCodeLovData: any = null;
  isCaseManagerSelected = true;
  isAccessTypeInternal = true;
  activeFlag = 'Y';
  userAccessType: any = UserAccessType.Internal;
  userRoleType: string = "";
  selectedUserRolesList: any = [];
  userFormGroup!: FormGroup;
  selectedDomain: any = null;
  selectedGroup: any = null;
  isFormSubmit: boolean = false;

  public formUiStyle: UIFormStyle = new UIFormStyle();
  constructor(
    private userManagementFacade: UserManagementFacade,
    private lovFacade: LovFacade,
  ) {}

  ngOnInit(): void {
    this.buildUserForm();
    this.subscribeLovData();
    this.loadDdlUserRole();
    this.lovFacade.getUserAccessTypeLov();
    this.lovFacade.getRoleTypeLov();
    this.lovFacade.getCaseManagerDomainLov();
    this.lovFacade.getCaseManagerAssistorGrpLov();
    this.disableFields();
  }

  private buildUserForm(){
    this.userFormGroup = new FormGroup({
      userAccessType: new FormControl(''),
      pNumber: new FormControl('', { validators: Validators.required }),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl('', {validators: Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,60}$/)}),
      role: new FormControl([], { validators: Validators.required }),
      domain: new FormControl({}),
      group: new FormControl({})
    });
  }

  get userFormControls() : any {
    return this.userFormGroup.controls;
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
  }

  onUserAccessValueChange(event: Event){
    let value = (event.target as HTMLInputElement).value.toUpperCase();
    if(value == UserAccessType.Internal){
      this.isAccessTypeInternal = true;
      this.setValidators(null);
    }else{
      this.isAccessTypeInternal = false;
      this.setValidators(Validators.required);
    }
    this.disableFields();
    this.userRoleType = this.getUserRoleType(value);
    this.loadDdlUserRole();
  }

  setValidators(vaidator: any){
    this.userFormGroup.controls['domain'].setValidators(
      vaidator
    );
    this.userFormGroup.controls['domain'].updateValueAndValidity();

    this.userFormGroup.controls['group'].setValidators(
      vaidator
    );
    this.userFormGroup.controls['group'].updateValueAndValidity();
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

  disableFields(){
    if(this.isAccessTypeInternal){
      this.userFormGroup.controls["firstName"].disable();
      this.userFormGroup.controls["lastName"].disable();
      this.userFormGroup.controls["email"].disable();
    }else{
      this.userFormGroup.controls["firstName"].enable();
      this.userFormGroup.controls["lastName"].enable();
      this.userFormGroup.controls["email"].enable();
    }
  }

  onUserSaveButtonClick(){
    this.userFormGroup.markAllAsTouched();
    this.isFormSubmit = true;
    if(this.userFormGroup.status == 'INVALID'){
      return;
    }
    let formControls = this.userFormGroup.controls;
    let user = {
      userTypeCode: formControls["userAccessType"].value,
      firstName: formControls["firstName"].value,
      lastName: formControls["lastName"].value,
      email: formControls["email"].value,
      roles: this.selectedUserRolesList,
      domainCode: formControls["domain"].value?.lovCode,
      assistorGroupCode: formControls["group"].value?.lovCode,
      pOrNbr: formControls["pNumber"].value
    };
    this.userManagementFacade.addUser(user);
  }

  onRoleValueChange(roles: any){
    this.selectedUserRolesList = [];
    roles.forEach((role: any) => {
      this.selectedUserRolesList.push(role.roleId);
    });
  }


}
