/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { LovFacade, UserAccessType, UserManagementFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { group } from '@angular/animations';
@Component({
  selector: 'system-config-user-detail',
  templateUrl: './user-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailComponent implements OnInit {
  @Input() isEditValue!: boolean;
  @Output() isDeactivatePopupOpened = new EventEmitter();
  @Input() userId: any;
  @Input() status: any;
  @Output() refreshGrid = new EventEmitter();
  isUserDeactivatePopup = false;
  deactivate = "Inactive";
  ddlUserRole$ = this.userManagementFacade.ddlUserRole$;
  userAccessTypeLov$ = this.lovFacade.userAccessTypeLov$;
  userRoleTypeCode$ = this.lovFacade.userRoleTypeLov$;
  caseManagerDomainLov$ = this.lovFacade.caseManagerDomainLov$;
  caseManagerAssistorGrp$ = this.lovFacade.caseManagerAssistorGrp$;
  pNumberSearchSubject$ = this.userManagementFacade.pNumberSearchSubject$;
  addUserResponse$ = this.userManagementFacade.addUserResponse$;
  isDeactivateValue!: boolean;
  userAccessTypeLovData: any = null;
  userRoleTypeCodeLovData: any = null;
  isCaseManagerSelected = true;
  isAccessTypeInternal = true;
  activeFlag = 'Y';
  userAccessType: any = "";
  userRoleType: string = UserAccessType.Internal;
  selectedUserRolesList: any = [];
  userFormGroup!: FormGroup;
  selectedDomain: any = null;
  selectedGroup: any = null;
  isFormSubmit: boolean = false;
  adUserPNumberData: any = null;
  isPNumberValueChanging: boolean = false;
  enteredPnumberValue: any;
  isRequestingPNumber: boolean = false;
  isPNumberAlreadyExists: boolean = false;

  public formUiStyle: UIFormStyle = new UIFormStyle();
  constructor(
    private userManagementFacade: UserManagementFacade,
    private lovFacade: LovFacade,
    private cd: ChangeDetectorRef
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
      userAccessType: new FormControl('', { validators: Validators.required }),
      pNumber: new FormControl('', { validators: Validators.required }),
      firstName: new FormControl('', { validators: Validators.required }),
      lastName: new FormControl('', { validators: Validators.required }),
      email: new FormControl('', {validators: [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,60}$/)]}),
      role: new FormControl([], { validators: Validators.required }),
      domain: new FormControl({}),
      group: new FormControl({}),
      jobTitle: new FormControl(''),
      adUserId: new FormControl('')
    });
  }

  get userFormControls() : any {
    return this.userFormGroup.controls;
  }

  private loadDdlUserRole() {    
    if(this.userRoleType == "") return;
    this.userManagementFacade.loadDdlUserRole(this.userRoleType, this.activeFlag);
  }

  subscribeLovData() {
    this.userAccessTypeLov$.subscribe({
      next: (data: any) => {      
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
    
    this.addUserResponse$.subscribe({
      next: (data) => {
        if(data.status == 0){
          this.isPNumberAlreadyExists = true;
        } else {
          this.isPNumberAlreadyExists = false;
        }
        this.cd.detectChanges();
      },
      error: (err) => {},
    });

    this.pNumberSearchSubject$.subscribe({
      next: (data) => {
        this.isRequestingPNumber = false;
        this.adUserPNumberData = data;  
        let formControls = this.userFormGroup.controls;
        if(data != null){                    
          formControls["firstName"].setValue(data.firstName == null ? '' : data.firstName);
          formControls["lastName"].setValue(data.lastName == null ? '' : data.lastName);
          formControls["email"].setValue(data.emailAddress);  
          formControls["jobTitle"].setValue(data.JobTitle == null ? '' : data.jobTitle);
          formControls["adUserId"].setValue(data.userId == null ? '' : data.userId);  
        } else {
          formControls["firstName"].setValue('');
          formControls["lastName"].setValue('');
          formControls["email"].setValue('');  
          formControls["jobTitle"].setValue('');
          formControls["adUserId"].setValue('');
        }
        this.cd.detectChanges();         
      },
      error: (err) =>{
        this.isRequestingPNumber = false;
      }
    })
  }

  onUserAccessValueChange(event: Event){
    let value = (event.target as HTMLInputElement).value.toUpperCase();
    if(value == UserAccessType.Internal){
      this.isAccessTypeInternal = true;
      this.setValidators(null, Validators.required);
    }else{
      this.isAccessTypeInternal = false;
      this.setValidators(Validators.required, null);              
    }
    this.disableFields();
    this.userRoleType = this.getUserRoleType(value);
    this.loadDdlUserRole();
  }

  setValidators(vaidator: any, pNumberValidator: any){
    this.userFormGroup.controls['firstName'].setValidators(
      vaidator
    );
    this.userFormGroup.controls['firstName'].updateValueAndValidity();

    this.userFormGroup.controls['lastName'].setValidators(
      vaidator
    );
    this.userFormGroup.controls['lastName'].updateValueAndValidity();

    this.userFormGroup.controls['domain'].setValidators(
      vaidator
    );
    this.userFormGroup.controls['domain'].updateValueAndValidity();

    this.userFormGroup.controls['group'].setValidators(
      vaidator
    );
    this.userFormGroup.controls['group'].updateValueAndValidity();

    this.userFormGroup.controls['pNumber'].setValidators(
      pNumberValidator
    );
    this.userFormGroup.controls['pNumber'].updateValueAndValidity();
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
    if(this.isPNumberValueChanging && (this.adUserPNumberData == null || this.isPNumberAlreadyExists)){
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
      pOrNbr: formControls["pNumber"].value,
      jobTitle: formControls["jobTitle"].value,
      adUserId: formControls["adUserId"].value,
    };
    this.userManagementFacade.addUser(user);
  }

  onRoleValueChange(roles: any){
    this.selectedUserRolesList = [];
    roles.forEach((role: any) => {
      this.selectedUserRolesList.push(role.roleId);
    });
  }

  onUserDeactivateClosed(){
    this.isUserDeactivatePopup=false;
  }
  loadUserListGrid(){
    this.refreshGrid.emit();
  }




  onDeactivateClicked()
    {
      this.isUserDeactivatePopup = true;
    }

  onPNumberValueChange(pNumber: any) {
    if(pNumber == ""){
      this.isPNumberValueChanging = false
    } else {
      this.isPNumberValueChanging = true;
    }    
    this.enteredPnumberValue = pNumber;
    this.isRequestingPNumber = true;
    this.isPNumberAlreadyExists = false;
    this.adUserPNumberData = null;
    this.userManagementFacade.searchPNumber(pNumber);
  }

  onCancel(){
    this.isDeactivatePopupOpened.emit();
    this.isDeactivateValue = true;
  }


}
