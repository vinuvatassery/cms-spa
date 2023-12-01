import {
  ChangeDetectionStrategy,
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { CaseFacade } from '@cms/case-management/domain';

@Component({
  selector: 'productivity-tools-approvals-review-possible-matches',
  templateUrl: './approvals-review-possible-matches.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalsReviewPossibleMatchesComponent implements OnInit {
  @Input() claimData:any;
  @Input() possibleMatchData$:any;
  @Output() loadPossibleMatchDataEvent = new EventEmitter<any>();
  @Output() closeReviewPossibleMatchesDialogClickedEvent = new EventEmitter<any>();
  @Output() saveReviewPossibleMatchesDialogClickedEvent = new EventEmitter<any>();
  isMatch: any=false;
  isNotMatch: any=false;
  possibleMatch:any;
  hasSaveButtonEnabled:boolean=false;
  ngOnInit(): void {
    this.loadPossibleMatch(this.claimData);
  }

  closePossibleMatches($event:any) {
    this.closeReviewPossibleMatchesDialogClickedEvent.emit($event);
  }

  loadPossibleMatch(data?: any) {
    this.loadPossibleMatchDataEvent.emit(data);
    this.possibleMatchData$.subscribe((response: any) => {
      if (response !== undefined && response !== null && response.length > 0) {
        this.hasSaveButtonEnabled = true;
        this.possibleMatch=response[0];
        this.cd.detectChanges();
      }
      else
      {
        this.closePossibleMatches(false);
      }
    });
  }

  onGoToProfileClick(data:any) {
    this.caseFacade.onClientProfileTabSelect("clt-info" ,data.clientId, data.clientCaseEligibilityId, data.clientCaseId);
    this.save(data);
  }

  save(data:any)
  {
    this.saveReviewPossibleMatchesDialogClickedEvent.emit(data);
  }

  constructor(private readonly cd: ChangeDetectorRef,private route: Router,
    private caseFacade : CaseFacade) {}
}
