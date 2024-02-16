import { Component,Input,OnInit,ChangeDetectionStrategy,ChangeDetectorRef } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {ClientNoteTypeCode, SmokingCessationFacade, CaseFacade} from '@cms/case-management/domain';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { Subject } from 'rxjs';
@Component({
  selector: 'case-management-smoking-cessation-list',
  templateUrl: './smoking-cessation-list.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmokingCessationListComponent implements OnInit {
  @Input() clientCaseId: any;
  @Input() clientId: any;
  @Input() clientCaseEligibilityId : any;
  isAddReferralSmokingCessationOpen = false;
  tareaCessationMaxLength = 300;
  tareaCessationCounter!: string;
  tareaCessationCharachtersCount!: number;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  gridSmokingData:any=[];
  smokingForm: FormGroup;
  isShowHistorical: boolean=false;
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
  smokingCessationProfilrPhotoSubject = new Subject();
   /** Constructor**/
   constructor(
    private readonly smokingCessationFacade : SmokingCessationFacade,
    private readonly formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly caseFacade: CaseFacade,
    private readonly userManagementFacade: UserManagementFacade
  ) { 
    this.smokingForm = this.formBuilder.group({smokingCessationNote: ['']});
  }

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadGridData();
  }

  loadGridData(){
    this.smokingCessationFacade.showLoader();
    this.smokingCessationFacade.loadSmokingCessationNotes(this.clientId,this.clientCaseId,this.clientCaseEligibilityId,ClientNoteTypeCode.smokingCessationReferral,this.isShowHistorical)
    .subscribe({
      next: (data:any) =>{
        this.gridSmokingData=data;
        this.smokingCessationFacade.hideLoader();
        if(this.gridSmokingData?.length > 0){
          this.loadDistinctUserIdsAndProfilePhoto(this.gridSmokingData);
        }
        this.cdr.detectChanges();
      },
      error: (error:any) =>{
        this.smokingCessationFacade.hideLoader();
      }
    });
  }

  loadDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.smokingCessationProfilrPhotoSubject.next(data);
          }
        },
      });
      this.cdr.detectChanges();
    }
}

  onIsShowHistoricalChange(){
    this.loadGridData();
  }

  onTareaCessationValueChange(event: any): void {
    this.tareaCessationCharachtersCount = event.length;
    this.tareaCessationCounter = `${this.tareaCessationCharachtersCount}/${this.tareaCessationMaxLength}`;
  }
  openAddReferralSmokingCessationClicked(){
    this.smokingForm.controls["smokingCessationNote"].setValue(null);
    this.tareaCessationCharachtersCount=0;
    this.isAddReferralSmokingCessationOpen = true;
  }

  closeAddReferralSmokingCessationClicked(){
    this.isAddReferralSmokingCessationOpen = false;
  }

  saveSmokingCessation(){
   const clientNote: any = {
      clientCaseEligibilityId: this.clientCaseEligibilityId,
      clientId: this.clientId,
      note: this.smokingForm.controls["smokingCessationNote"].value,
      NoteTypeCode:ClientNoteTypeCode.smokingCessationReferral
    };
    if(clientNote.note===null || clientNote.note===''){
      this.closeAddReferralSmokingCessationClicked();
    }
    this.smokingCessationFacade.showLoader();
    this.smokingCessationFacade.createSmokingCessationNote(clientNote).subscribe({
      next: (x:any) =>{
        this.smokingCessationFacade.showHideSnackBar(
          SnackBarNotificationType.SUCCESS,
          'Smoking Cesation note added'
        );
        this.smokingCessationFacade.hideLoader();
        this.closeAddReferralSmokingCessationClicked();
        this.loadGridData();

      },
      error: (error:any) =>{
        this.smokingCessationFacade.hideLoader();
      }
    });
     
  }
}
