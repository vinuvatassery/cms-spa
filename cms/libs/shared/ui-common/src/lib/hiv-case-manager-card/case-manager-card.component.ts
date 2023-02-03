/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';
@Component({
  selector: 'common-case-manager-card',
  templateUrl: './case-manager-card.component.html',
  styleUrls: ['./case-manager-card.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseManagerCardComponent implements OnInit{
 @Input() gridHoverDataItem !: any 
 @Input() userImage$ : any

 @Output() loadUserImageEvent =  new EventEmitter<string>();

 imageData! : any
 imageLoaderVisible =true;

 /** Lifecycle hooks **/
 ngOnInit(): void {  
  this.loadUserImage();
}

   loadUserImage()
   { 
    this.loadUserImageEvent.emit(this.gridHoverDataItem?.caseManagerId)   
   }
  
   onLoad()
   {    
    this.imageLoaderVisible = false;
   }
}
