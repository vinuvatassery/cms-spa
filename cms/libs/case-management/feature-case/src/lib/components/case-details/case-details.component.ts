/** Angular **/
import {
  Component, Input, OnInit,
  ChangeDetectorRef, ChangeDetectionStrategy, OnChanges, SimpleChanges, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

/** Internal Libraries **/
import { UIFormStyle } from '@cms/shared/ui-tpa'

/** external Libraries **/
import { first, Subscription } from 'rxjs';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { ProgramCode, CaseOriginCode } from '@cms/case-management/domain';
import { LoaderService } from '@cms/shared/util-core';
import { AuthService } from '@cms/shared/util-oidc';
import { UserDataService } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-case-detailed-summary',
  templateUrl: './case-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseDetailsSummaryComponent implements OnChanges, OnDestroy, OnInit {

  /// filter autocomplete with startswith
  public showInputLoader = false;
  public caseOwnerfilterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "startsWith",
  };

  isProgramSelectionOpened = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();

  date = new Date();
  caseOwnersObject!: any
  caseOwnerList!:any;
  userData!:any
  private userProfileSubsriction !: Subscription;

  @Input() isProgramVIsible!: any;
  @Input() parentForm!: FormGroup;
  @Input() isSubmitted: any;
  @Input() caseSearchResults$!: any
  @Input() caseOwners !: any
  @Input() ddlPrograms!: any
  @Input() ddlCaseOrigins!: any
  @Input() selectedProgram!: any
  @Input() selectedCase!: any

  private caseDataDataSubscription !: Subscription;
  currentDate = new Date();

  /** Constructor**/
  constructor(private readonly router: Router, private readonly ref: ChangeDetectorRef,
    private loaderService: LoaderService,
    private authService: AuthService,
    private readonly userDataService: UserDataService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['caseOwners']?.currentValue?.source != null) {
      this.caseOwners.pipe()
        .subscribe((Owners: any[]) => {
          this.caseOwnersObject = [...Owners];
          if (!this.isProgramVIsible) {
            this.GetCaseData();
          }
        });

    }
  }


  ngOnInit(): void {
    this.setDefaultProgram();
    if (this.isProgramVIsible) {
      this.getCaseOwners();
    }
  }

  setDefaultProgram() {
    this.ddlPrograms
      .subscribe({
        next: (programs: any) => {
          if (programs.length > 0) {
            this.parentForm.patchValue(
              {
                programId: programs.filter(
                  (data: any) => data.programCode == ProgramCode.DefaultProgram
                )[0].programId
              })
            this.loaderService.hide()
          }
        }
      });
  }


  ///get case details
  ///with session id
  GetCaseData() {
    this.caseDataDataSubscription = this.selectedCase?.pipe(first((caseData: { programId: any; }) => caseData.programId != null))
      .subscribe((caseData: any) => {
        this.parentForm.reset()
        if (caseData.programId != null && caseData.caseStartDate != null
          && caseData.assignedCwUserId != null) {
          this.parentForm.setValue(
            {
              applicationDate: new Date(caseData.caseStartDate),
              caseOriginCode: caseData?.caseOriginCode,
              caseOwnerId: caseData?.assignedCwUserId,
              programId: caseData?.programId,
              concurrencyStamp: caseData?.concurrencyStamp
            })
          this.formValidation(caseData);
        }
      })
  }

  ngOnDestroy(): void {
    if (!this.isProgramVIsible) {
      this.caseDataDataSubscription.unsubscribe();
    }
    else{
      this.userProfileSubsriction.unsubscribe();
    }
  }

  formValidation(caseData: any) {
    if (caseData.caseOriginCode == CaseOriginCode.ClientPortal) {
      this.parentForm.controls['caseOriginCode'].disable();
    }
  }
  
  getLoggedInCaseWorker(){   
      this.parentForm.controls['caseOwnerId'].setValue(this.userData[0].loginUserId);    
  }
  getCaseOwners(){
    this.caseOwners.subscribe((element:any)=>{
      if(element.length>0){
        this.caseOwnerList=element;
        this.getLoggedInUserProfile();
      }
    })
  }
  
  getLoggedInUserProfile(){
    this.userProfileSubsriction=this.userDataService.getProfile$.subscribe((profile:any)=>{
      if(profile){
        this.userData=profile;
        this.getLoggedInCaseWorker();
      }
    })
  }
}
