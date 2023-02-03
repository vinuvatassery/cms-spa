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

 @Output() loadprofilePhotoEvent =  new EventEmitter<string>();

 imageData! : any
 imageLoaderVisible =true;

 /** Lifecycle hooks **/
 ngOnInit(): void {
  this.loadprofilePhoto();
}

   loadprofilePhoto()
   {    
    this.loadprofilePhotoEvent.emit(this.gridHoverDataItem?.caseManagerId)   
   }
  
   onLoad()
   {    
    this.imageLoaderVisible = false;
   }
}
