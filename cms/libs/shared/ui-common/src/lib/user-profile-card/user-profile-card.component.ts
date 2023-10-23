/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { UserDefaultRoles } from '@cms/case-management/domain';

@Component({
  selector: 'common-user-profile-card',
  templateUrl: './user-profile-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class UserProfileCardComponent implements OnInit {

  @Input() userId !: any 
  @Input() reassign? : boolean  = false
  @Input() sendEmail? : boolean = false
  @Input() clientId: any;
  @Input() clientCaseId: any;
  @Output() reassignClicked = new EventEmitter<any>();
  userImage$ = this.userManagementFacade.userImage$;
  userById$ = this.userManagementFacade.usersById$;
  caseOwners$ = this.userManagementFacade.usersByRole$;
  imageLoaderVisible =true;
  businessLogicPopupOpen = false;
  hasReassignPermission = false;
 
    /** Constructor**/
    constructor(     
      private userManagementFacade : UserManagementFacade,
    ) { 
      this.hasReassignPermission = userManagementFacade.hasPermission(['Reassign_Cases']);
    }


  /** Lifecycle hooks **/
  ngOnInit(): void {  
   this.loadProfilePhoto();
   this.loadProfileData();
   this.loadUsersByRole();
 }
 
    loadProfilePhoto()
    {   
      if(this.userId)
      {
        this.userManagementFacade.getUserImage(this.userId)
      }
    }

    loadProfileData()
    { 
      if(this.userId)
      {
        this.userManagementFacade.getUserById(this.userId)  
      }  
    }
   
    onLoad()
    {    
     this.imageLoaderVisible = false;
    }
    
    openBusinessPopup()
    {
       this.businessLogicPopupOpen = true;
    }

    businessLogicPopupClose()
    {
      this.businessLogicPopupOpen = false;
    }

    loadUsersByRole()
    {
      this.userManagementFacade.getUsersByRole(UserDefaultRoles.CACaseWorker);
    }

    onReassignClicked(data:any) {
      this.reassignClicked.emit(data);    
    }

 }