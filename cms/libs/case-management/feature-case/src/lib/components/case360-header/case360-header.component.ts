/** Angular **/
import { Component, ChangeDetectionStrategy, Output, EventEmitter, OnInit, Input } from '@angular/core';
/** External libraries **/
import { DialItemAnimation } from '@progress/kendo-angular-buttons';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'case-management-case360-header',
  templateUrl: './case360-header.component.html',
  styleUrls: ['./case360-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Case360HeaderComponent implements OnInit {
  /** Public properties **/
  @Input() loadedClientHeader: any
  @Input() caseWorkerId: any
  @Input() clientProfileImpInfo$: any
  @Input() currentGroup$!: Observable<any>;
  @Input() ddlGroups$!: Observable<any>;
  @Input() groupUpdated$!: Observable<any>;
  @Output() loadClientProfileInfoEvent = new EventEmitter();
  @Output() loadClientImpInfoEvent = new EventEmitter();
  @Output() loadChangeGroupEvent = new EventEmitter<string>();
  @Output() updateChangeGroupEvent = new EventEmitter<any>();
  isAnimationOptionsOpened: boolean | DialItemAnimation = false;
  isStatusPeriodDetailOpened = false;
  isGroupDetailOpened$ = new BehaviorSubject<boolean>(false);

 /** Lifecycle hooks **/
 ngOnInit(): void {  
    this.loadClientProfileInfoEvent.emit();
    this.addGroupUpdatedSubscription();  
  }

/** Internal event methods **/
  onStatusPeriodDetailClosed() {
    this.isStatusPeriodDetailOpened = false;
  }

  onStatusPeriodDetailClicked() {
    this.isStatusPeriodDetailOpened = true;
  }

  onGroupDetailClosed() {
    this.isGroupDetailOpened$.next(false);
  }

  onGroupDetailClicked(eligibilityId: string) {
    if (eligibilityId) {
      this.loadChangeGroupEvent.emit(eligibilityId);
    }

    this.isGroupDetailOpened$.next(true);
  }

  loadClientImpInfo() {
    this.loadClientImpInfoEvent.emit()
  }

  onGroupChangeUpdateClicked(group: any) {
    group = {
      eligibilityId: this.loadedClientHeader.clientCaseEligibilityId,
      groupCodeId: group.groupCodeId,
      groupStartDate: group.groupStartDate
    };
    this.updateChangeGroupEvent.emit(group);
  }

  onGroupChangeCancelClicked() {
    this.isGroupDetailOpened$.next(false);
  }

  addGroupUpdatedSubscription() {
    this.groupUpdated$.subscribe((value: boolean) => {    
      if(value){
      this.isGroupDetailOpened$.next(false);
        this.loadClientProfileInfoEvent.emit();
      }  
    })
  }

}
