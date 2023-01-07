/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';
@Component({
  selector: 'case-management-hiv-case-manager-card',
  templateUrl: './hiv-case-manager-card.component.html',
  styleUrls: ['./hiv-case-manager-card.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HivCaseManagerCardComponent implements OnInit{
 @Input() gridHoverDataItem !: any 
 @Input() userImage$ : any

 @Output() loadUserImageEvent =  new EventEmitter<string>();

 imageData! : any

 /** Lifecycle hooks **/
 ngOnInit(): void {
  this.loadUserImage();
}

   loadUserImage()
   {    
    this.loadUserImageEvent.emit(this.gridHoverDataItem?.caseManagerId)   
   }
  
}
