/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnInit,
  Input,
  TemplateRef,
  ChangeDetectorRef,
} from '@angular/core';
/** External libraries **/
import { DialItemAnimation } from '@progress/kendo-angular-buttons';
import {
  ClientEligibilityFacade,
  CaseFacade,
} from '@cms/case-management/domain';
import { BehaviorSubject, Observable } from 'rxjs';
import { DialogService } from '@progress/kendo-angular-dialog';
@Component({
  selector: 'case-management-case360-header',
  templateUrl: './case360-header.component.html',
  styleUrls: ['./case360-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Case360HeaderComponent implements OnInit {
  /** Public properties **/
  @Input() loadedClientHeader: any;
  @Input() caseWorkerId: any;
  @Input() clientProfileImpInfo$: any;
  @Input() clientCaseEligibilityId: any;
  @Input() clientId: any;
  @Input() clientCaseId: any;
  @Output() loadClientProfileInfoEvent = new EventEmitter();
  @Output() loadClientImpInfoEvent = new EventEmitter();
  @Input() currentGroup$!: Observable<any>;
  @Input() ddlGroups$!: Observable<any>;
  @Input() groupUpdated$!: Observable<any>;
  @Output() loadChangeGroupEvent = new EventEmitter<string>();
  @Output() updateChangeGroupEvent = new EventEmitter<any>();
  @Output() createCerSessionEvent = new EventEmitter<string>();
  @Output() reassignClicked = new EventEmitter<any>();

  isAnimationOptionsOpened: boolean | DialItemAnimation = false;
  isStatusPeriodDetailOpened = false;
  isGroupDetailOpened$ = new BehaviorSubject<boolean>(false);
  isEditEligibilityFlag!: boolean;
  groupChangeTitle!: string;
  private statusPeriodDialog: any;
  private statusGroupDialog: any;
  constructor(
    private readonly clientEligibilityFacade: ClientEligibilityFacade,
    private readonly caseFacade: CaseFacade,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadClientProfileInfoEvent.emit();
    this.clientEligibilityFacade.eligibilityPeriodPopupOpen$.subscribe(
      (response) => {
        this.isStatusPeriodDetailOpened = response;
      }
    );
    this.addGroupUpdatedSubscription();
  }

  /** Internal event methods **/
  onStatusPeriodDetailClosed(): void {
    this.isStatusPeriodDetailOpened = false;
  }

  public onStatusPeriodDetailClicked(template: TemplateRef<unknown>): void {
    this.statusPeriodDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
    this.isEditEligibilityFlag = false;
  }

  onStatusPeriodEditClicked(template: TemplateRef<unknown>): void {
    this.statusPeriodDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
    this.isEditEligibilityFlag = true;
    this.isStatusPeriodDetailOpened = true;
  }

  onGroupDetailClicked(eligibilityId: string, template: TemplateRef<unknown>): void {
    if (eligibilityId) {
      this.loadChangeGroupEvent.emit(eligibilityId);
    }

    this.isGroupDetailOpened$.next(true);
    this.statusGroupDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  loadClientImpInfo() {
    this.loadClientImpInfoEvent.emit();
  }

  onGroupChangeUpdateClicked(group: any) {
    group = {
      eligibilityId: this.loadedClientHeader.clientCaseEligibilityId,
      groupCodeId: group.groupCodeId,
      groupStartDate: group.groupStartDate,
    };
    this.updateChangeGroupEvent.emit(group);
    this.onModalGroupClose(true);
  }

  onGroupChangeCancelClicked() {
    this.isGroupDetailOpened$.next(false);
    this.groupChangeTitle = '';
  }

  addGroupUpdatedSubscription() {
    this.groupUpdated$.subscribe((value: boolean) => {
      if (value) {
        this.isGroupDetailOpened$.next(false);
        this.loadClientProfileInfoEvent.emit();
        this.groupChangeTitle = '';
      }
    });
    this.clientEligibilityFacade.eligibilityDate$.subscribe((eligibilityDate) =>{
      if(eligibilityDate){
        this.loadedClientHeader.eilgibilityStartDate = eligibilityDate?.eilgibilityStartDate;
        this.loadedClientHeader.eligibilityEndDate = eligibilityDate?.eligibilityEndDate;
        this.cdr.detectChanges();
      }
      
    })
  }

  checkIfSCheduledGroup(isScheduled: boolean) {
    this.groupChangeTitle = isScheduled
      ? 'Edit Scheduled Group Change'
      : 'Change Group';
  }

  onModalSaveAndClose(result: any) {
    if (result) {
      this.isStatusPeriodDetailOpened = false;
      this.statusPeriodDialog.close();
      this.loadClientProfileInfoEvent.emit();
    }
  }
  onModalPeriodClose(result: any) {
    if (result) {
      this.statusPeriodDialog.close();
    }
  }

  onModalGroupClose(result: any) {
    if (result) {
      this.statusGroupDialog.close();
    }
  }

  createCerSession() {
    //2169 iii.	If the Eligibility has been disenrolled for the CER the link will disable
    if (this.loadedClientHeader?.caseStatus !== 'DISENROLLED') {
      this.createCerSessionEvent.emit();
    }
  }

  onReassignClicked(data:any) {debugger;
    console.log('3-data',data);
    this.reassignClicked.emit(data);    
  }
}
