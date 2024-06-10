/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from '@angular/core';
import { LovFacade, UserAccessType, UserManagementFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigurationProvider, LoaderService } from '@cms/shared/util-core';
import { NotificationService } from '@progress/kendo-angular-notification';
import { Subscription } from 'rxjs';
@Component({
  selector: 'system-config-user-detail',
  templateUrl: './user-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailComponent implements OnInit, OnDestroy {
  @Input() isEditValue!: boolean;
  @Output() isDeactivatePopupOpened = new EventEmitter();
  @Input() userId: any;
  @Input() status: any;
  @Output() refreshGrid = new EventEmitter();
  isUserDeactivatePopup = false;
  deactivate = "Inactive";
  ddlUserRole$ = this.userManagementFacade.ddlUserRole$;
  userAccessTypeLov$ = this.lovFacade.userAccessTypeLov$;
  caseManagerDomainLov$ = this.lovFacade.caseManagerDomainLov$;
  caseManagerAssistorGrp$ = this.lovFacade.caseManagerAssistorGrp$;
  pNumberSearchSubject$ = this.userManagementFacade.pNumberSearchSubject$;
  addUserResponse$ = this.userManagementFacade.addUserResponse$;
  loginUserDetail$ = this.userManagementFacade.loginUserDetail$;
  

  isDeactivateValue!: boolean;
  userAccessTypeLovData: any = null;
  isCaseManagerSelected = true;
  isAccessTypeInternal = true;
  activeFlag = 'Y';
  userAccessType: any = "";
  userRoleType: string = UserAccessType.Internal;
  selectedUserRolesList: any = [];
  userFormGroup!: FormGroup;
  selectedDomain: any = null;
  domainLovList: any = [];
  selectedGroup: any = null;
  groupLovList: any = [];
  userRoleLov: any = [];
  isFormSubmit: boolean = false;
  adUserPNumberData: any = null;
  isPNumberValueChanging: boolean = false;
  enteredPnumberValue: any;
  isRequestingPNumber: boolean = false;
  isPNumberAlreadyExists: boolean = false;
  isAdUser: boolean = false;
  isUserAlreadyExists = false;
  userDetailData: any;  
  userDetailRoles: any = [];
  userStatus$ = this.userManagementFacade.canUserBeDeactivated$;
  userAssignedActiveClientStatusSubscription!: Subscription;
  public hideAfter = this.configurationProvider.appSettings.snackbarHideAfter;
  public duration =
    this.configurationProvider.appSettings.snackbarAnimationDuration;
  @ViewChild('notificationTemplate', { static: true }) notificationTemplate!: TemplateRef<any>;

  
  public formUiStyle: UIFormStyle = new UIFormStyle();
  constructor(
    private userManagementFacade: UserManagementFacade,
    private lovFacade: LovFacade,
    private cd: ChangeDetectorRef,
    private configurationProvider:ConfigurationProvider,
    private readonly notificationService: NotificationService,
    private router: Router,
    private readonly loaderService: LoaderService,

  ) {}

  ngOnInit(): void {
    this.buildUserForm();
    this.subscribeLovData();    
    this.lovFacade.getUserAccessTypeLov();
    this.lovFacade.getCaseManagerDomainLov();
    this.lovFacade.getCaseManagerAssistorGrpLov();
    this.IsUserValidForDeactivation();
    this.disableFields();
    if(!this.isEditValue){
      this.loadDdlUserRole();
    }
    if(this.isEditValue){
      this.getUserDetail();      
    }
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
    this.userFormGroup.controls["role"].setValue([]);
    this.userManagementFacade.loadDdlUserRole(this.userRoleType, this.activeFlag);
  }

  subscribeLovData() {
    this.userAccessTypeLov$.subscribe({
      next: (data: any) => {      
        this.userAccessTypeLovData = data;
      },
      error: (err) => {},
    });

    this.caseManagerDomainLov$.subscribe({
      next: (data) => {
        this.domainLovList = data;
      },
      error: (err) => {},
    });
    
    this.caseManagerAssistorGrp$.subscribe({
      next: (data) => {
        this.groupLovList = data;
      },
      error: (err) => {},
    });

    this.ddlUserRole$.subscribe({
      next: (data) => {
        this.userRoleLov = data;
        if(this.isEditValue){
          let selectedRoleValues: any = [];
          for(let role of this.userDetailRoles){
            let roleData = data.filter((x: any)=> x.roleCode == role);
            if(roleData && roleData.length > 0){
              this.selectedUserRolesList.push(roleData[0].roleId);
              selectedRoleValues.push(roleData[0]);
            }            
          }
          this.userFormGroup.controls["role"].setValue(selectedRoleValues);
          this.cd.detectChanges();
        }
      },
      error: (err) => {},
    });
    
    this.addUserResponse$.subscribe({
      next: (data) => {
        if(data.status == 0 && data.message.toLowerCase().includes('pnumber')){
          this.isPNumberAlreadyExists = true;
        } else if(data.status == 0 && data.message.toLowerCase().includes('user')) {
          this.isUserAlreadyExists = true;
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
          formControls["jobTitle"].setValue(data.jobTitle == null ? '' : data.jobTitle);
          formControls["adUserId"].setValue(data.userId == null ? '' : data.userId);
          this.isAdUser = true;
          this.changeFieldStateOfExternalUser(true);
        } else {
          formControls["firstName"].setValue('');
          formControls["lastName"].setValue('');
          formControls["email"].setValue('');  
          formControls["jobTitle"].setValue('');
          formControls["adUserId"].setValue('');
          this.isAdUser = false;
          this.changeFieldStateOfExternalUser(false);
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
    this.userRoleType = this.getUserRoleType(value);
    this.userTypeBasedValidation();
    this.loadDdlUserRole();
  }

  userTypeBasedValidation() {
    if(this.userRoleType == UserAccessType.Internal){
      this.isAccessTypeInternal = true;
      this.setValidators(null, Validators.required);
    } else{
      this.isAccessTypeInternal = false;
      this.setValidators(Validators.required, null);              
    }
    this.disableFields();
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
    }else if(!this.isAdUser){
      this.userFormGroup.controls["firstName"].enable();
      this.userFormGroup.controls["lastName"].enable();
      this.userFormGroup.controls["email"].enable();
    }
    if(this.isEditValue){
      this.userFormGroup.controls["firstName"].disable();
      this.userFormGroup.controls["lastName"].disable();
      this.userFormGroup.controls["email"].disable();

      this.userFormGroup.controls["pNumber"].disable();
      this.userFormGroup.controls["userAccessType"].disable();
    }
  }

  changeFieldStateOfExternalUser(isDisable: boolean){
    if(this.userRoleType == UserAccessType.Internal){
      return;
    }
    if(isDisable){
      this.userFormGroup.controls["firstName"].disable();
      this.userFormGroup.controls["lastName"].disable();
      this.userFormGroup.controls["email"].disable();
    }else{
      this.userFormGroup.controls["firstName"].enable();
      this.userFormGroup.controls["lastName"].enable();
      this.userFormGroup.controls["email"].enable();
    }

  }

  navigateToDetails() {
    this.router.navigate(['/system-config/cases/case-assignment']);
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
      loginUserId: this.isEditValue ? this.userId : null
    };
    if(!this.isEditValue){
      this.userManagementFacade.addUser(user);
    }else{
      this.userManagementFacade.updateUserDetail(user);
    }    
  }

  onRoleValueChange(roles: any){
    this.selectedUserRolesList = [];
    roles.forEach((role: any) => {
      this.selectedUserRolesList.push(role.roleId);
    });
  }
  onUserDeactivateClosed(){
    this.status = this.deactivate;
    this.isUserDeactivatePopup=false;
    this.cd.detectChanges();
  }
  loadUserListGrid(){
    this.refreshGrid.emit();
  }

  onDeactivateClicked()
    {
      this.userManagementFacade.getUserAssignedActiveClientCount(this.userId);      
    }

  onPNumberValueChange(pNumber: any) {
    if(pNumber == ""){
      this.isPNumberValueChanging = false
      return;
    } else {
      this.isPNumberValueChanging = true;
    }    
    this.enteredPnumberValue = pNumber;
    this.isRequestingPNumber = true;
    this.isPNumberAlreadyExists = false;
    this.isUserAlreadyExists = false;
    this.adUserPNumberData = null;
    this.userManagementFacade.searchPNumber(pNumber);
  }

  onCancel(){
    this.isDeactivatePopupOpened.emit();
    this.isDeactivateValue = true;
  }

  getUserDetail() {
    this.userManagementFacade.getUserDetail(this.userId);
    this.loginUserDetail$.subscribe({
      next: (user: any) => {
        this.userDetailData = user;
        this.userAccessType = user.userTypeCode;
        this.userRoleType = this.getUserRoleType(user.userTypeCode);
        this.userTypeBasedValidation();
        this.userDetailRoles = user.roles;
        this.loadDdlUserRole();
        let formControls = this.userFormGroup.controls;
        formControls["firstName"].setValue(user.firstName == null ? '' : user.firstName);
        formControls["lastName"].setValue(user.lastName == null ? '' : user.lastName);
        formControls["email"].setValue(user.email);  
        formControls["jobTitle"].setValue(user.JobTitle == null ? '' : user.jobTitle);
        formControls["adUserId"].setValue(user.adUserId == null ? '' : user.adUserId);
        formControls["pNumber"].setValue(user.pOrNbr == null ? '' : user.pOrNbr);

        formControls["domain"].setValue(user.domainCode == null ? '' : user.domainCode);
        let domain = this.domainLovList.filter((x:any) => x.lovCode == user.domainCode);
        this.selectedDomain = domain.length > 0 ? domain[0] : null;

        formControls["group"].setValue(user.assistorGroupCode == null ? '' : user.assistorGroupCode);
        let group = this.groupLovList.filter((x: any) => x.lovCode == user.assistorGroupCode)
        this.selectedGroup = group.length > 0 ? group[0] : user.assistorGroupCode; 
      }
    })
  }

  IsUserValidForDeactivation(){
    this.userAssignedActiveClientStatusSubscription = this.userStatus$.subscribe((response: any) => {
      if(response.status > 0){
        this.isUserDeactivatePopup = true;
        this.cd.detectChanges();
        this.loaderService.hide();
      }
      else
      {
          this.notificationService.show({
          content: this.notificationTemplate,        
          position: { horizontal: 'center', vertical: 'top' },
          animation: { type: 'fade', duration: this.duration },
          closable: true,
          type: { style: "error", icon: true },        
          cssClass: 'reminder-notification-bar',
          hideAfter:this.hideAfter
        });
        this.loaderService.hide();
      }
    });
  }

  ngOnDestroy(): void {
      this.userAssignedActiveClientStatusSubscription?.unsubscribe();
  }
}
