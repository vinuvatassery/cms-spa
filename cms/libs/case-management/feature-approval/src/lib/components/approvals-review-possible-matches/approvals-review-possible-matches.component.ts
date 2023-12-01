import {
  ChangeDetectionStrategy,
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

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
  warningMessage:any="";
  ngOnInit(): void {
    this.loadPossibleMatch(this.claimData);
  }

  closePossibleMatches($event:any) {
    this.closeReviewPossibleMatchesDialogClickedEvent.emit($event);
  }

  loadPossibleMatch(data?: any) {
    this.loadPossibleMatchDataEvent.emit(data);
    this.possibleMatchData$.subscribe((response: any) => {
      if (response !== undefined && response !== null && response.status == 2)
      {
        this.warningMessage = response.message;
        this.cd.detectChanges();
      }
      else if (response !== undefined && response !== null && response.status==1) {
        this.hasSaveButtonEnabled = true;
        this.possibleMatch=response;
        this.cd.detectChanges();
      }
      else
      {
        this.warningMessage="Client information updated, please refresh the imported claims grid.";
      }
    });
  }

  onGoToProfileClick(data:any) {
    this.save(data);    
  }

  save(data:any)
  {
    this.saveReviewPossibleMatchesDialogClickedEvent.emit(data);
  }

  constructor(private readonly cd: ChangeDetectorRef) {}
}
