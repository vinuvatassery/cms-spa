/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';


@Component({
  selector: 'cms-vendor-special-handling',
  templateUrl: './vendor-special-handling.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorSpecialHandlingComponent implements OnInit{
    /** Public properties **/   
    @Input() vendorProfileSpecialHandling$ : any
    @Output() loadSpecialHandlingEvent =  new EventEmitter();

         /** Lifecycle hooks **/
    ngOnInit(): void 
    {
       this.loadSpecialHandlingEvent.emit()  
    }

    specialHandlingValidator(object : any)
    {
     if(object?.filter((x : any)=>x !="").length > 0)
     {
      return true
     }
     return false;
    }

    infoObjectValidator(object : any)
    {
      if(object == null ||  object?.physicalAddress
        || this.specialHandlingValidator(object?.specialHandlingMailCodes))
      {        
      return true;
      }      
      return false
    }
}