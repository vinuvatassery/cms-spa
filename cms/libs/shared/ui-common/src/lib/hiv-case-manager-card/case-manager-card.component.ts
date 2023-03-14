/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';
@Component({
  selector: 'common-case-manager-card',
  templateUrl: './case-manager-card.component.html',
  styleUrls: ['./case-manager-card.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseManagerCardComponent implements OnInit{
 @Input() user !: any 
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
    this.loadprofilePhotoEvent.emit(this.user?.caseManagerId)   
   }
  
   onLoad()
   {    
    this.imageLoaderVisible = false;
   }
}
