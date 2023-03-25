/** Angular **/
import {Component, Input } from '@angular/core';

import {  Router } from '@angular/router';

/** Internal Libraries **/
import { ContactFacade} from '@cms/case-management/domain';
import { LovFacade } from '@cms/system-config/domain';


@Component({
  selector: 'case-management-profile-contact-page',
  templateUrl: './profile-contact-page-component.html',
  styleUrls: [],
})


export class ProfileContactPageComponent  {

@Input() profileClientId! : number;
@Input() clientCaseEligibilityId : any;

      /** Constructor**/
  constructor(  
    private readonly router: Router,
    private readonly contactFacade : ContactFacade,
    private readonly lovFacade : LovFacade
  ) { }
  pageSizes = this.contactFacade.gridPageSizes;
  sortValue  = this.contactFacade.sortValue;
  sortType  = this.contactFacade.sortType;
  sort  = this.contactFacade.sort;
  clientEmails$ = this.contactFacade.clientEmails$;
  clientEmail$ = this.contactFacade.clientEmail$;
  preferredClientEmail$ = this.contactFacade.preferredClientEmail$;
  deactivateClientEmail$ = this.contactFacade.deactivateClientEmail$;
  removeClientEmail$ = this.contactFacade.removeClientEmail$;
  addClientEmailResponse$ = this.contactFacade.addClientEmailResponse$ 
  clientPhones$ = this.contactFacade.clientPhones$;
  clientPhone$ = this.contactFacade.clientPhone$;
  preferredClientPhone$ = this.contactFacade.preferredClientPhone$;
  deactivateClientPhone$ = this.contactFacade.deactivateClientPhone$;
  removeClientPhone$ = this.contactFacade.removeClientPhone$;
  addClientPhoneResponse$ = this.contactFacade.addClientPhoneResponse$ 
  lovClientPhoneDeviceType$ = this.lovFacade.lovClientPhoneDeviceType$;

    //#region client Email//NOSONAR
  loadClientEmailsHandle( gridDataRefinerValue : any ): void
  {    
      const gridDataRefiner = 
      {
        skipcount: gridDataRefinerValue.skipCount,
        maxResultCount : gridDataRefinerValue.pagesize,
        sort : gridDataRefinerValue.sortColumn,
        sortType : gridDataRefinerValue.sortType,
        showDeactivated: gridDataRefinerValue.showDeactivated
      } 
      
        this.pageSizes = this.contactFacade.gridPageSizes;
      this.contactFacade.loadClientEmails(this.clientCaseEligibilityId
        , gridDataRefiner.skipcount ,gridDataRefiner.maxResultCount  ,gridDataRefiner.sort , gridDataRefiner.sortType,gridDataRefinerValue.showDeactivated);       
      
  }

   addClientEmailHandle(emailData : any): void
    {  
      emailData.clientCaseEligibilityId =this.clientCaseEligibilityId  
      emailData.clientId = this.profileClientId;
      this.contactFacade.addClientEmail(emailData);
    } 


    loadClientEmailHandle(clientEmailId : string): void
    {    
      this.contactFacade.loadClientEmail(this.profileClientId ,clientEmailId,this.clientCaseEligibilityId );
    } 
  
    preferredClientEmailHandle(clientEmailId : string): void
    {        
      this.contactFacade.preferredClientEmail(this.profileClientId ,clientEmailId);
    } 

    deactivateClientEmailHandle(clientEmailId : string): void
    {        
      this.contactFacade.deactivateClientEmail(this.profileClientId ,clientEmailId);
    } 

    removeClientEmailHandle(clientEmailId : string): void
    {        
      this.contactFacade.removeClientEmail(this.profileClientId ,clientEmailId);
    } 
    //#endregionclient Email//NOSONAR


    //#region client phone//NOSONAR
  loadClientPhonesHandle( gridDataRefinerValue : any ): void
  {    
      const gridDataRefiner = 
      {
        skipcount: gridDataRefinerValue.skipCount,
        maxResultCount : gridDataRefinerValue.pagesize,
        sort : gridDataRefinerValue.sortColumn,
        sortType : gridDataRefinerValue.sortType,
        showDeactivated: gridDataRefinerValue.showDeactivated
      } 
      
        this.pageSizes = this.contactFacade.gridPageSizes;
      this.contactFacade.loadClientPhones(this.profileClientId
        , gridDataRefiner.skipcount ,gridDataRefiner.maxResultCount  ,gridDataRefiner.sort , gridDataRefiner.sortType,gridDataRefinerValue.showDeactivated);       
      
  }

   addClientPhoneHandle(phoneData : any): void
    {  
      phoneData.clientId = this.profileClientId;
      this.contactFacade.addClientPhone(phoneData);
    } 


    loadClientPhoneHandle(clientPhoneId : string): void
    {        
      this.contactFacade.loadClientPhone(this.profileClientId ,clientPhoneId);
    } 

    loadDeviceTypeLovHandle()
    {
      this.lovFacade.getClientPhoneDeviceTypeLovs()
    }

    preferredClientPhoneHandle(clientPhoneId : string): void
    {        
      this.contactFacade.preferredClientPhone(this.profileClientId ,clientPhoneId);
    } 

    deactivateClientPhoneHandle(clientPhoneId : string): void
    {        
      this.contactFacade.deactivateClientPhone(this.profileClientId ,clientPhoneId);
    } 

    removeClientPhoneHandle(clientPhoneId : string): void
    {        
      this.contactFacade.removeClientPhone(this.profileClientId ,clientPhoneId);
    } 
    //#endregionclient phone//NOSONAR
}