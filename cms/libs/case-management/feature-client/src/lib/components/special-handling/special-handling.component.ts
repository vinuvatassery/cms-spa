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
    this.loadApplicantInfo();
  }
  private loadApplicantInfo() {
   
    this.loaderService.show();
    this.clientFacade
      .load(
        this.clientId,
        this.clientCaseId,
        this.clientCaseEligibilityId)
      .subscribe({
        next: (response: any) => {
          if (response) {
            this.loaderService.hide();
            /**Populating Client */
            //this.applicantInfo.client = response.client;
            if(response.clientNotes?.length > 0){
              this.clientNotes = response.clientNotes;
            }else {
              this.clientNotes = [];
            }
            
            this.answersKeys = Object.entries(response?.client).map(([key, value]) => ({key, value}));
            
            if(this.answersKeys && this.answersKeys.length > 0){
               this.questions.forEach(question =>{
                question.answer = this.answersKeys.find(answer =>answer.key == question.key)?.value;
                if(question.answer == "YES" && question.ohterKey != 'interpreterType' && question.otherFormatKey != 'materialInAlternateFormatOther' && question.descKey != 'materialInAlternateFormatDesc' && question.key != 'limitingConditionCode'){
                  question.answer = question.answer+' ' +', Since age'+ ' ' +this.answersKeys.find(answer =>answer.key == question.ohterKey)?.value; 
                } else if(question.id == 1  ){
                  question.answer =this.clientNotes.length > 0 ? this.clientNotes.map(function (e) { return e?.note;}).join(', ') : 'No Notes'
                } else if(question.answer == "YES" && question.ohterKey == 'interpreterType'){
                  question.answer ='YES' + ' ,' + this.answersKeys.find(answer =>answer.key == question.ohterKey)?.value;
                }
                else if(question.answer == "YES"  &&  question.descKey == 'materialInAlternateFormatDesc' && !this.answersKeys.find(answer =>answer.key == question.otherFormatKey)?.value){
                  question.answer = 'YES' + ' ,' + this.answersKeys.find(answer =>answer.key == question.descKey)?.value;
                }
                else if(question.answer == "YES"  &&  question.otherFormatKey == 'materialInAlternateFormatOther' ){
                  question.answer ='YES' + ' ,' + this.answersKeys.find(answer =>answer.key == question.descKey)?.value +' ,'+ this.answersKeys.find(answer =>answer.key == question.otherFormatKey)?.value;
                }
              });
              this.cdRef.detectChanges();
            }
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
        },
      });
  }
  /** Private methods **/
  private loadSpecialHandlings() { 
    this.clientFacade.loadSpecialHandlings();
  }

  /** Internal event methods **/
  onEditSpecialHandlingClosed() {
    this.isEditSpecialHandlingPopup = false;
    this.loadApplicantInfo();
  }

  onEditSpecialHandlingClicked() {
    this.isEditSpecialHandlingPopup = true;
  }
  onSpecialHandlingPopupClose(event:any){
      this.onEditSpecialHandlingClosed();
  }
}
