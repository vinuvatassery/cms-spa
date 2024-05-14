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
  isAccessTypeInternal = false;
  activeFlag = 'Y';
  userAccessType: any;
  userRoleType: string = "";
  userRolesList = [];
  userFormGroup!: FormGroup;

  public formUiStyle: UIFormStyle = new UIFormStyle();
  constructor(
    private userManagementFacade: UserManagementFacade,
    private lovFacade: LovFacade,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildUserForm();
    this.subscribeLovData();
    this.loadDdlUserRole();
    this.lovFacade.getUserAccessTypeLov();
    this.lovFacade.getRoleTypeLov();
    this.lovFacade.getCaseManagerDomainLov();
    this.lovFacade.getCaseManagerAssistorGrpLov();
  }

  private buildUserForm(){
    this.userFormGroup = new FormGroup({
      userAccessType: new FormControl(''),
      pNumber: new FormControl('', { validators: Validators.required }),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
      role: new FormControl({}),
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
    this.disableFields();
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
  }

}
