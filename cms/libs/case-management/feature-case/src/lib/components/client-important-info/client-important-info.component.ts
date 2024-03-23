/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';


@Component({
  selector: 'case-management-client-important-info',
  templateUrl: './client-important-info.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ClientImportantInfoComponent implements OnInit{
    /** Public properties **/
    @Input() clientCaseId! : string
    @Input() clientProfileImpInfo$ : any
    @Output() loadClientImpInfoEvent =  new EventEmitter();

         /** Lifecycle hooks **/
    ngOnInit(): void 
    {      
       this.loadClientImpInfoEvent.emit()  
    }

    showClientNotesHeader(clientNotes:any){
      return clientNotes.some((notes:any) => notes !="")
    }

    clientArrayObjectValidator(object : any)
    {
     if(object?.filter((x : any)=>x).length > 0)
     {
      return true
     }
     return false;
    }

    infoObjectValidator(object : any)
    {
      if(object == null || object?.caseManagerEmail || object?.caseManagerFullName || object?.caseManagerPhone 
        || this.clientArrayObjectValidator(object?.clientDisabilities) || this.clientArrayObjectValidator(object?.clientNotes)
        || object?.preferredContact)
      {        
      return true;
      }      
      return false
    }
}