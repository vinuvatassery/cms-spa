/** Angular **/
import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';

@Component({
  selector: 'common-user-profile-card',
  templateUrl: './user-profile-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class UserProfileCardComponent implements OnInit  , OnDestroy{

   @Input() userId !: any 
   @Input() reassign? : boolean  = false
   @Input() sendEmail? : boolean = false
  userImage$ = this.userManagementFacade.userImage$;
  userById$ = this.userManagementFacade.usersById$;
  imageLoaderVisible =true;
  businessLogicPopupOpen = false;
 
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
      if(this.userId)
      {
        this.userManagementFacade.getUserImage(this.userId)
      }
    }

    loadprofileData()
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
    ngOnDestroy(): void {
      debugger
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