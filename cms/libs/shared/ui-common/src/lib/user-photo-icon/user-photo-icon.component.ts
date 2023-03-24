/** Angular **/
import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';

@Component({
  selector: 'common-user-photo-icon',
  templateUrl: './user-photo-icon.component.html',
  styleUrls: ['./user-photo-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class UserPhotoIconComponent implements OnInit{

   @Input() userId !: any  
  
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
  
 }