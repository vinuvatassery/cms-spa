/** Angular **/
import {
    DateInputSize,
    DateInputRounded,
    DateInputFillMode,
  } from '@progress/kendo-angular-dateinputs';
  /** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'common-case-card-type',
  templateUrl: './case-common-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseCommonCardComponent { 
    currentDate = new Date();
  public size: DateInputSize = 'medium';
  public rounded: DateInputRounded = 'full';
  public fillMode: DateInputFillMode = 'outline';
  selectedProgram:any;

  @Input() programList: any
  @Input() caseOrigins: any;
  @Input() caseOwners:any;
  @Input() isSaveAndChangeClickedFromNewCase:any ;

  constructor(
    private readonly router: Router,
    private readonly ref: ChangeDetectorRef
  ) {}


  /** Lifecycle hooks **/
ngOnInit(): void {
    
   
  }

ngOnChanges():void{
console.log(this.programList);
}



}
