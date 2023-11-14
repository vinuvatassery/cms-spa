import {
  ChangeDetectionStrategy,
  Component,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';

@Component({
  selector: 'productivity-tools-approvals-review-possible-matches',
  templateUrl: './approvals-review-possible-matches.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalsReviewPossibleMatchesComponent {
  @Input() importedClaimId:any;
  @Input() clientName:any;
  @Input() dateOfBirth:any;
  @Input() policyId:any;
  caseWorkerId:any="F1854F7D-C8EE-46A7-9B03-869681A8437A";
  caseWorkerName:any="Case4.Worker4";

  @Output() closeReviewPossibleMatchesDialogClickedEvent = new EventEmitter<any>();

  closePossibleMatches() { 
    this.closeReviewPossibleMatchesDialogClickedEvent.emit();
  }  
}
