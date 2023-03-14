/** Angular **/
import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';

@Component({
  selector: 'common-user-profile-card',
  templateUrl: './user-profile-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class UserProfileCardComponent implements OnInit{

   @Input() userId !: any 
   @Input() reassign !: boolean 
  
  userImage$ = this.userManagementFacade.userImage$;
  userById$ = this.userManagementFacade.usersById$;
  imageLoaderVisible =true;
  userData! : any
 
    /** Constructor**/
    constructor(     
      private userManagementFacade : UserManagementFacade
    ) {}


  /** Lifecycle hooks **/
  ngOnInit(): void {  
   this.loadprofilePhoto();
   this.loadprofileData();     
 }
 
    loadprofilePhoto()
    {   
     this.userManagementFacade.getUserImage(this.userId)
    }

    loadprofileData()
    { 
     this.userManagementFacade.getUsersById(this.userId)    
    }
   
    onLoad()
    {    
     this.imageLoaderVisible = false;
    }
   
 }