/** Angular **/
import { Component, ChangeDetectionStrategy, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { ClientProfile } from '@cms/case-management/domain';
import { first } from 'rxjs';

@Component({
  selector: 'case-management-client-read-only-view',
  templateUrl: './client-read-only-view.component.html',
  styleUrls: ['./client-read-only-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientReadOnlyViewComponent implements OnInit{
  /** Public properties **/
  @Input() clientProfile : any
  @Output() loadReadOnlyClientInfoEvent =  new EventEmitter();
  @Output() loadprofilePhotoEvent =  new EventEmitter<string>();
  @Input() userImage$: any 

  //public client! : ClientProfile
  isEditClientInformationPopup = false;
  caseManagerHoverDataItem! : any
   /** Lifecycle hooks **/
 ngOnInit(): void {
  this.loadReadOnlyClientInfoEvent.emit()

  //this.onClientProfileLoad()
}


  /** Internal event methods **/
  onCloseEditClientInformationClicked() {
    this.isEditClientInformationPopup = false;
  }

  onEditClientInformationClicked() {
    this.isEditClientInformationPopup = true;
  }


  onManagerHover(clientData : ClientProfile)
  {
    const caseManagerData =
    {
      caseManagerId : clientData?.caseManagerId ,
      caseManagerName   : clientData?.caseManagerName , 
      pNumber   : clientData?.caseManagerPNumber ,
      domainCode   : clientData?.caseManagerDomainCode ,  
      assisterGroup   : clientData?.caseManagerAssisterGroup ,  
      email   : clientData?.caseManagerEmail , 
      phone   : clientData?.caseManagerPhone ,  
      fax   : clientData?.caseManagerFax , 
      address1   : clientData?.caseManagerAddress1 , 
      address2   : clientData?.caseManagerAddress2 ,  
      city   : clientData?.caseManagerCity ,  
      state   : clientData?.caseManagerState , 
      zip   : clientData?.caseManagerZip ,
    }
    this.caseManagerHoverDataItem = caseManagerData;
  }

  loadprofilePhotoEventHandler(caseManagerId : any)
  {    
   this.loadprofilePhotoEvent.emit(caseManagerId) 
  }
}
