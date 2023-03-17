/** Angular **/
import { Component, ChangeDetectionStrategy, Output, EventEmitter, OnInit, Input } from '@angular/core';
/** External libraries **/
import { DialItemAnimation } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'case-management-case360-header',
  templateUrl: './case360-header.component.html',
  styleUrls: ['./case360-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Case360HeaderComponent implements OnInit{
  /** Public properties **/
  @Input() loadedClientHeader : any
  @Input() caseWorkerId : any
  @Input() clientProfileImpInfo$ : any
  @Output() loadClientProfileInfoEvent =  new EventEmitter();
  @Output() loadClientImpInfoEvent =  new EventEmitter();
  isAnimationOptionsOpened: boolean | DialItemAnimation = false;
  isStatusPeriodDetailOpened = false;
  isGroupDetailOpened = false;

     /** Lifecycle hooks **/
 ngOnInit(): void {
  this.loadClientProfileInfoEvent.emit()  
}

  /** Internal event methods **/
  onStatusPeriodDetailClosed() {
    this.isStatusPeriodDetailOpened = false;
  }

  onStatusPeriodDetailClicked() {
    this.isStatusPeriodDetailOpened = true;
  }

  onGroupDetailClosed() {
    this.isGroupDetailOpened = false;
  }

  onGroupDetailClicked() {
    this.isGroupDetailOpened = true;
  }

  loadClientImpInfo()
  {
    this.loadClientImpInfoEvent.emit()  
  }
}
