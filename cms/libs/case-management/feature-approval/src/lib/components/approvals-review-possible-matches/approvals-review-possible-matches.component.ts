import {
  ChangeDetectionStrategy,
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'productivity-tools-approvals-review-possible-matches',
  templateUrl: './approvals-review-possible-matches.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalsReviewPossibleMatchesComponent implements OnInit, OnDestroy {
  @Input() claimData:any;
  @Input() possibleMatchData$:any;
  @Output() loadPossibleMatchDataEvent = new EventEmitter<any>();
  @Output() closeReviewPossibleMatchesDialogClickedEvent = new EventEmitter<any>();
  possibleMatchDatasubscriber!: Subscription;
  isMatch: any=false;
  isNotMatch: any=false;
  possibleMatch:any;
  hasSaveButtonEnabled:boolean=false;
  warningMessage:any="";
  ngOnInit(): void {
    this.loadPossibleMatch(this.claimData);
  }

  closePossibleMatches($event:any) {
    this.closeReviewPossibleMatchesDialogClickedEvent.emit($event);
  }

  loadPossibleMatch(data?: any) {
    this.loadPossibleMatchDataEvent.emit(data);
    this.possibleMatchDatasubscriber = this.possibleMatchData$.subscribe((response: any) => {
      if (response !== undefined && response !== null && response.status == 2)
      {
        this.warningMessage = response.message;
        this.cd.detectChanges();
      }
      else if (response !== undefined && response !== null) {
        this.hasSaveButtonEnabled = true;
        this.possibleMatch=response;
        this.cd.detectChanges();
      }
    });
  }

  onGoToProfileClick(data:any) {
    this.closeReviewPossibleMatchesDialogClickedEvent.emit(true);
    this.route.navigate([`/case-management/cases/case360/${data.clientId}`]);      
  }

  ngOnDestroy(): void {
    this.possibleMatchDatasubscriber?.unsubscribe();
  }
  constructor(private readonly cd: ChangeDetectorRef,private route: Router,) {}
}
