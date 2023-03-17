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
}