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
  ngOnInit(): void {
    let request = {
      policyId:this.claimData.policyId,
      firstName:this.claimData.firstName,
      lastName:this.claimData.lastName,
      dateOfBirth:this.claimData.dateOfBirth
    }
    this.loadPossibleMatch(request);
  }

  closePossibleMatches($event:any) {
    this.closeReviewPossibleMatchesDialogClickedEvent.emit($event);
  }

  loadPossibleMatch(data?: any) {
    this.loadPossibleMatchDataEvent.emit(data);
    this.possibleMatchData$.subscribe((response: any) => {
      if (response !== undefined && response !== null) {
        this.possibleMatch=response[0];
        this.cd.detectChanges();
      }
      else
      {
        this.closePossibleMatches(false);
      }
    });
  }

  onMatchClicked()
  {
    this.isMatch =  true;
    this.isNotMatch = !this.isMatch;
    this.hasSaveButtonEnabled = true;
  }

  onNotMatchClicked()
  {
    this.isNotMatch =  true;
    this.isMatch = !this.isNotMatch;
    this.hasSaveButtonEnabled = true;
  }

  savePossibleMatches(data?:any)
  {
    let request = {
      clientId:data.clientId,
      policyId: this.claimData.policyId,
      invoiceExceptionId: this.claimData.invoiceExceptionId,
      claimId: this.claimData.importedClaimId,
      serviceDate:this.claimData.dateOfService,
      isPossibleMatch: this.isMatch ? true : false,
      entityTypeCode: this.claimData.entityTypeCode
    }
    this.save(request);
  }

  save(data:any)
  {
    this.saveReviewPossibleMatchesDialogClickedEvent.emit(data);
  }

  constructor(private readonly cd: ChangeDetectorRef) {}
}
