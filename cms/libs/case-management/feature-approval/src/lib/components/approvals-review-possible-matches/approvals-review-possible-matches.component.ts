import {
  ChangeDetectionStrategy,
  Component,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'productivity-tools-approvals-review-possible-matches',
  templateUrl: './approvals-review-possible-matches.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalsReviewPossibleMatchesComponent {
  @Output() closeReviewPossibleMatchesDialogClickedEvent =
    new EventEmitter<any>();
  closePossibleMatches() {
    this.closeReviewPossibleMatchesDialogClickedEvent.emit();
  }
}
