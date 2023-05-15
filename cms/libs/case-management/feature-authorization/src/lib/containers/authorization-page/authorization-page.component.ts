/** Angular **/
import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'case-management-authorization-page',
  templateUrl: './authorization-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationPageComponent {
  btnDisabled = true; 
  isCerForm = false;
  dateSignature?:any;
  @Input() cerDateSignatureEvent =  new EventEmitter();


ngOnInit(): void 
{
}

loadDateSignature(event : Date){
  this.dateSignature = event;
  if(this.dateSignature != null){
    this.btnDisabled = false;
  }else{
    this.btnDisabled = true;
  }
}
}