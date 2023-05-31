/** Angular **/
import { Component, ChangeDetectionStrategy, Output, EventEmitter, OnInit, Input,ChangeDetectorRef } from '@angular/core';
/** Facades **/
import { ClientFacade, CaseFacade } from '@cms/case-management/domain';
import { LoaderService } from '@cms/shared/util-core';
@Component({
  selector: 'case-management-special-handling',
  templateUrl: './special-handling.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecialHandlingComponent implements OnInit {
  /** Public properties **/
  @Input() clientId : any
  @Input() clientCaseEligibilityId : any
  @Input() clientCaseId : any
  specialHandlings$ = this.clientFacade.specialHandlings$;
  @Output() UpdateApplicantInfo = new EventEmitter();
  isEditSpecialHandlingPopup = false;
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
  applicantInfo:any;
  clientNotes:any[] =[];
  answersKeys:any[] =[];
  questions:any[] =[];
  /** Constructor**/
  constructor(private clientFacade: ClientFacade,
    private loaderService: LoaderService,
    private cdRef: ChangeDetectorRef,
    private caseFacade: CaseFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadSpecialHandlings();
    this.specialHandlings$.subscribe(question =>{
      
      this.questions = question;
    })
    this.UpdateApplicantInfo.emit();
  }
  /** Private methods **/
  private loadSpecialHandlings() { 
    this.clientFacade.loadSpecialHandlings();
  }

  /** Internal event methods **/
  onEditSpecialHandlingClosed() {
    this.isEditSpecialHandlingPopup = false;
    this.UpdateApplicantInfo.emit();
  }

  onEditSpecialHandlingClicked() {
    this.isEditSpecialHandlingPopup = true;
  }
  onSpecialHandlingPopupClose(event:any){
      this.onEditSpecialHandlingClosed();
  }
}
