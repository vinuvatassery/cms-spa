/** Angular **/
import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
/** Internal Libraries **/
import { CaseDetailsFacade, CompletionStatusFacade, ContactFacade } from '@cms/case-management/domain';
import {
  DateInputSize,
  DateInputRounded,
  DateInputFillMode,
} from '@progress/kendo-angular-dateinputs';

import { Subscription,Observable, of } from 'rxjs';
@Component({
  selector: 'case-management-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss'],
})

export class ContactPageComponent implements OnInit, OnDestroy {

  public size: DateInputSize = 'medium';
  public rounded: DateInputRounded = 'full';
  public fillMode: DateInputFillMode = 'outline';
  /** Public properties **/
  ddlPreferredContactMethods$ = this.contactFacade.ddlPreferredContactMethods$;
  ddlStates$ = this.contactFacade.ddlStates$;
  ddlCountries$ = this.contactFacade.ddlCountries$;
  ddlRelationships$ = this.contactFacade.ddlRelationships$;
  isNoHomePhoneChecked!: boolean;
  isNoCellPhoneChecked!: boolean;
  isNoWorkPhoneChecked!: boolean;
  isNoOtherPhoneChecked!: boolean;
  isNoEmailChecked = true;
  isNoProofOfHomeChecked!: boolean;
  isNoFriendsOrFamilyChecked!: boolean;
  completeStaus$ = this.completionStatusFacade.completionStatus$;

  /** Private properties **/
  private saveClickSubscription !: Subscription;

  constructor(
    private readonly contactFacade: ContactFacade,
    private readonly completionStatusFacade: CompletionStatusFacade,
    private caseDetailsFacade: CaseDetailsFacade
  ) {}


  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadDdlRelationships();
    this.loadDdlStates();
    this.loadDdlCountries();
    this.saveClickSubscribed();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }

  canDeactivate(): Observable<boolean> {
    //if (!this.isSaved) {
      //const result = window.confirm('There are unsaved changes! Are you sure?');
      //return of(result);
      return of(true);
    //}

    //return of(true);
  }

  /** Private methods **/
  private loadDdlRelationships() {
    this.contactFacade.loadDdlRelationships();
  }

  private updateCompletionStatus(status: any) {
    this.completionStatusFacade.updateCompletionStatus(status);
  }

  onChangeCounterButtonClick() {
    this.updateCompletionStatus({
      name: 'Contact Info',
      completed: 31,
      total: 31,
    });
  }

  private loadDdlStates() {
    this.contactFacade.loadDdlStates();
  }

  private loadDdlCountries() {
    this.contactFacade.loadDdlCountries();
  }

  private saveClickSubscribed():void{
    this.saveClickSubscription = this.caseDetailsFacade.saveAndContinueClicked.subscribe(() => {
      this.contactFacade.save().subscribe((response: boolean) => {
        if(response){
          this.caseDetailsFacade.navigateToNextCaseScreen.next(true);
        }
      })
     });
  }

  /** Internal event methods **/
  onNoEmailCheckboxClicked() {
    this.isNoEmailChecked = !this.isNoEmailChecked;
  }
}
