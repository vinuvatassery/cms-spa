/** Angular **/
import { OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CaseDetailsFacade, ClientFacade } from '@cms/case-management/domain';
import { Observable, of, Subscription } from 'rxjs';
import { CaseFacade } from '@cms/case-management/domain';
import { UntypedFormControl, FormGroup, Validators,UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'case-management-client-page',
  templateUrl: './client-page.component.html',
  styleUrls: ['./client-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ClientPageComponent implements OnInit, OnDestroy {

  /** Public properties **/

  /** Private properties **/
  private saveClickSubscription !: Subscription;
  private programList:any;
  private caseOwners:any;
  private caseOrigins:any;
  clientPageForm!: UntypedFormGroup;
  private clientData:any;

  caseOwners$ = this.caseFacade.caseOwners$;
  ddlPrograms$ = this.caseFacade.ddlPrograms$;
  ddlCaseOrigins$ = this.caseFacade.ddlCaseOrigins$;
  caseInfo$=this.caseFacade.caseInfo$;

  constructor(private caseDetailsFacade: CaseDetailsFacade,
    private clientFacade:ClientFacade,
    private readonly caseFacade: CaseFacade){

    
  }


  /** Lifecycle hooks **/

  ngOnInit(): void {
    this.saveClickSubscribed();
    this.loadDdlCaseOrigins();
    this.loadCaseOwners();
    this.loadClientInfo();
    this.buildForm();
  }

  private buildForm() {
    console.log(this.caseInfo$);
    this.clientPageForm = new UntypedFormGroup({
      clientDetails: new UntypedFormControl('', Validators.required)
    });
  }

  private loadClientInfo() {
    this.caseFacade.getClientInfo();
  }
  
  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }

  private loadCaseOwners() {
    this.caseFacade.loadCaseOwners();
  }

  private loadDdlCaseOrigins() {
    this.caseFacade.loadDdlCaseOrigins();
  }

  /** Public  methods **/
  canDeactivate(): Observable<boolean> {
    //if (!this.isSaved) {
      const result = window.confirm('There are unsaved changes! Are you sure?');
      return of(result);
    //}

    //return of(true);
  }

  /** Private methods **/
  private saveClickSubscribed():void{
    this.saveClickSubscription = this.caseDetailsFacade.saveAndContinueClicked.subscribe(() => {
      this.clientFacade.save().subscribe((response: boolean) => {
        if(response){
          this.caseDetailsFacade.navigateToNextCaseScreen.next(true);
        }
      })
     });
  }
}
