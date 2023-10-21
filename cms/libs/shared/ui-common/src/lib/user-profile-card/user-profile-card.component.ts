/** Angular **/
import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';

@Component({
  selector: 'common-user-profile-card',
  templateUrl: './user-profile-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class UserProfileCardComponent implements OnInit {

   @Input() userId !: any 
   @Input() reassign? : boolean  = false
   @Input() sendEmail? : boolean = false
  userImage$ = this.userManagementFacade.userImage$;
  userById$ = this.userManagementFacade.usersById$;
  imageLoaderVisible =true;
  businessLogicPopupOpen = false;
  hasReassignPermission = false;
  title = '';
 
    /** Constructor**/
    constructor(     
      private userManagementFacade : UserManagementFacade
    ) {}


  /** Lifecycle hooks **/
  ngOnInit(): void {  
   this.loadProfilePhoto();
   this.loadProfileData(); 
   this.hasReassignPermission = this.userManagementFacade.hasPermission(['Reassign_Cases']);
   this.title = this.hasReassignPermission? 'Re-assign Case' : 'Assign New Case Worker?'    
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

 }