/** Angular **/
import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
/** Internal Libraries **/
import { WorkflowFacade, CompletionStatusFacade, ContactFacade, NavigationType } from '@cms/case-management/domain';
import {
  DateInputSize,
  DateInputRounded,
  DateInputFillMode,
} from '@progress/kendo-angular-dateinputs';
import { UIFormStyle } from '@cms/shared/ui-tpa'

import { Subscription, Observable, of, mergeMap, forkJoin } from 'rxjs';
@Component({
  selector: 'case-management-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss'],
})

export class ContactPageComponent implements OnInit, OnDestroy {

  public formUiStyle : UIFormStyle = new UIFormStyle();
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
    private workflowFacade: WorkflowFacade
  ) { }

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadDdlRelationships();
    this.loadDdlStates();
    this.loadDdlCountries();
    this.addSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
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

  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved]) => {
      if (isSaved) {
        this.workflowFacade.navigate(navigationType);
      }
    });
  }

  private save() {
    let isValid = true;
    // TODO: validate the form
    if (isValid) {
      return this.contactFacade.save();
    }

    return of(false)
  }

  /** Internal event methods **/
  onNoEmailCheckboxClicked() {
    this.isNoEmailChecked = !this.isNoEmailChecked;
  }
}
