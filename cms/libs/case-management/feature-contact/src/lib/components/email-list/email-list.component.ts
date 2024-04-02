/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
/** facades **/
import { State } from '@progress/kendo-data-query';
import { first, Subject, Subscription } from 'rxjs';
import { CaseFacade } from '@cms/case-management/domain';
import { UserManagementFacade } from '@cms/system-config/domain';
@Component({
  selector: 'case-management-email-list',
  templateUrl: './email-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailListComponent implements OnChanges, OnDestroy {
export class EmailListComponent implements OnChanges, OnDestroy {
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() clientEmailsData$: any;
  @Input() clientEmail$: any;
  @Input() lovClientEmailDeviceType$: any;
  @Input() addClientEmailResponse$: any;
  @Input() preferredClientEmail$: any;
  @Input() deactivateClientEmail$: any;
  @Input() removeClientEmail$: any;
  @Input() paperless$: any;
  @Input() clientEmailProfilePhoto$!: any;
  @Input() clientEmailProfilePhoto$!: any;
 
  @Output() loadClientEmailsListEvent = new EventEmitter<any>();
  @Output() addClientEmailEvent = new EventEmitter<any>();
  @Output() loadDeviceTypeLovEvent = new EventEmitter<any>();
  @Output() loadSelectedEmailEvent = new EventEmitter<any>();
  @Output() preferredClientEmailEvent = new EventEmitter<any>();
  @Output() deactivateClientEmailEvent = new EventEmitter<any>();
  @Output() removeClientEmailEvent = new EventEmitter<any>();
  @Output() loadClientPaperLessStatusEvent = new EventEmitter<any>();
  @Output() reloadPhonesEvent = new EventEmitter();

  /** Public properties   **/
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isEditEmailAddress!: boolean;
  isEmailAddressDetailPopup = false;
  isDeactivateEmailAddressPopup = false;
  deletebuttonEmitted = false;
  editbuttonEmitted = false;
  activateButtonEmitted = false;
  preferredButtonEmitted = false;
  subscriptionData!: Subscription;
  selectedEmailData!: any;
  editformVisibleSubject = new Subject<boolean>();
  gridEmailDataSubject = new Subject<any>();
  editformVisible$ = this.editformVisibleSubject.asObservable();
  gridEmailData$ = this.gridEmailDataSubject.asObservable();
  isOpenedEmailEdit = false;
  isOpenedDeleteConfirm = false;
  selectedclientEmailId!: string;
  public state!: State;
  historychkBoxChecked = false;
  loader = false;
  paperlessFlag!: any;
  // gridOptionData: Array<any> = [{ text: 'Options' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
  userEmailProfilrPhotoSubject = new Subject<any>();
  clientEmailsDataSubscription = new Subscription();
  userEmailProfilrPhotoSubject = new Subject<any>();
  clientEmailsDataSubscription = new Subscription();
  public gridOption = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Email Address',
      buttonName: 'edit',
      icon: 'edit',
      click: (clientEmailId: string): void => {
        if (!this.editbuttonEmitted) {
          this.selectedclientEmailId = '';
          this.editbuttonEmitted = true;
          this.onEmailAddressDetailClicked(true, clientEmailId);
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Make Preferred',
      icon: 'star',
      buttonName: 'preferred',
      click: (clientEmailId: string): void => {
        if (!this.preferredButtonEmitted) {
          this.selectedclientEmailId = '';
          this.preferredButtonEmitted = true;
          this.onPreferredEmailClicked(clientEmailId);
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate Email',
      icon: 'block',
      buttonName: 'deactivate',
      click: (clientEmailId: string): void => {
        if (!this.activateButtonEmitted) {
          this.selectedclientEmailId = '';
          this.activateButtonEmitted = true;
          this.onDeactivateEmailAddressClicked(clientEmailId);
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Email',
      icon: 'delete',
      buttonName: 'delete',
      click: (clientEmailId: string): void => {
        if (!this.deletebuttonEmitted) {
          this.deletebuttonEmitted = true;
          this.onRemoveClick(clientEmailId);
        }
      },
    },
  ];

  constructor(private caseFacade: CaseFacade,){  
  constructor(private caseFacade: CaseFacade,){  
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadClientEmailsList();
  }
  pageselectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadClientEmailsList();
  }

  ngOnDestroy(): void {
    this.clientEmailsDataSubscription?.unsubscribe();
  }
  ngOnDestroy(): void {
    this.clientEmailsDataSubscription?.unsubscribe();
  }
  /** Private methods **/
  private loadClientEmailsList(): void {
    this.loadEmails(
      this.state.skip ?? 0,
      this.state.take ?? 0,
      this.sortValue,
      this.sortType,
      false
    );
  }
  loadEmails(
    skipcountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string,
    showDeactivated: boolean
  ) {
    const gridDataRefinerValue = {
      skipCount: skipcountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      showDeactivated: this.historychkBoxChecked,
    };
    this.loader = true;
    this.gridDataHandle();
    this.gridDataHandle();
    this.loadClientEmailsListEvent.next(gridDataRefinerValue);
  }

  /** grid event methods **/

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.loadClientEmailsList();
  }

  gridDataHandle() {
    this.clientEmailsDataSubscription = this.clientEmailsData$.subscribe((data: any) => {
    this.clientEmailsDataSubscription = this.clientEmailsData$.subscribe((data: any) => {
      this.gridEmailDataSubject.next(data);
      if (data?.total >= 0 || data?.total === -1) {
        this.loader = false;
      }
    });
  }

  /** Internal event methods **/
  onEmailAddressDetailClosed() {
    this.editbuttonEmitted = false;
    this.isEmailAddressDetailPopup = false;
    this.isOpenedEmailEdit = false;
    this.editformVisibleSubject.next(this.isOpenedEmailEdit);
  }

  onEmailAddressDetailClicked(editValue: boolean, clientEmailId: string) {
    this.isEditEmailAddress = editValue;
    if (clientEmailId) {
      this.loadSelectedEmailEvent.emit(clientEmailId);
      this.onSelectedEmailFormLoad();
    } else {
      this.loadClientPaperLessStatusEvent.emit();
      this.loadPeperLessStatus();
    }
  }

  loadPeperLessStatus() {    
    this.paperless$
      ?.pipe(first((emailData: any) => emailData?.paperlessFlag != null))
      .subscribe((emailData: any) => {
        if (emailData?.paperlessFlag) {
          this.paperlessFlag = emailData?.paperlessFlag;
          this.isOpenedEmailEdit = true;
          this.editformVisibleSubject.next(this.isOpenedEmailEdit);
        }
      });
  }

  onDeactivateEmailAddressClosed() {
    this.isDeactivateEmailAddressPopup = false;
    this.activateButtonEmitted = false;
  }

  onDeactivateEmailAddressClicked(clientEmailId: string) {
    this.isDeactivateEmailAddressPopup = true;
    this.selectedclientEmailId = clientEmailId;
    this.onEmailAddressDetailClosed();
  }

  addClientEmailHandle(emailData: any): void {
    this.editbuttonEmitted = true;
    this.loader = true;
    this.addClientEmailEvent.emit(emailData);

    this.addClientEmailResponse$
      .pipe(first((addResponse: any) => addResponse != null))
      .subscribe((addResponse: any) => {
        if (addResponse === true) {
          this.loadClientEmailsList();
          this.onEmailAddressDetailClosed();
          if(emailData?.preferredFlag === 'Y')
          {
          this.reloadPhones()
          }
        }
      });
  }

  onSelectedEmailFormLoad() {
    this.subscriptionData = this.clientEmail$
      ?.pipe(first((emailData: any) => emailData?.clientEmailId != null))
      .subscribe((emailData: any) => {
        if (emailData?.clientEmailId) {
          this.selectedEmailData = {
            clientemailId: emailData?.clientEmailId,
            email: emailData?.email,
            detailMsgFlag: emailData?.detailMsgFlag,
            preferredFlag: emailData?.preferredFlag,
            paperlessFlag: emailData?.paperlessFlag,
            isDeleted : emailData?.isDeleted
          };
          this.isOpenedEmailEdit = true;
          this.editformVisibleSubject.next(this.isOpenedEmailEdit);
        }
      });
  }

  reloadPhones()
  {
     this.reloadPhonesEvent.emit()
  } 

  onPreferredEmailClicked(clientEmailId: string) {
    this.loader = true;
    this.preferredClientEmailEvent.emit(clientEmailId);
    this.preferredClientEmail$
      .pipe(first((Response: any) => Response != null))
      .subscribe((Response: any) => {
        if (Response === true) {
          this.preferredButtonEmitted = false;
          this.loadClientEmailsList();
          this.reloadPhones()
        }
      });
  }

  handleAcceptEmailRemove(isDelete: boolean) {
    if (isDelete) {
      this.loader = true;
      this.deletebuttonEmitted = false;
      this.removeClientEmailEvent.emit(this.selectedclientEmailId);

      this.removeClientEmail$
        .pipe(first((deleteResponse: any) => deleteResponse != null))
        .subscribe((deleteResponse: any) => {
          if (deleteResponse ?? false) {
            this.loadClientEmailsList();
          }
        });
    }
    this.onDeleteConfirmCloseClicked();
  }

  onDeleteConfirmCloseClicked() {
    this.deletebuttonEmitted = false;
    this.isOpenedDeleteConfirm = false;
  }

  onRemoveClick(clientEmailId: string) {
    this.isOpenedDeleteConfirm = true;
    this.selectedclientEmailId = clientEmailId;
  }

  handleAcceptEmailDeactivate(isDeactivate: boolean) {
    if (isDeactivate) {
      this.loader = true;
      this.deletebuttonEmitted = false;
      this.deactivateClientEmailEvent.emit(this.selectedclientEmailId);

      this.deactivateClientEmail$
        .pipe(first((deactResponse: any) => deactResponse != null))
        .subscribe((deactResponse: any) => {
          if (deactResponse ?? false) {
            this.loadClientEmailsList();
          }
        });
    }
    this.onDeactivateEmailAddressClosed();
  }

  onhistorychkBoxChanged() {
    this.historychkBoxChecked = !this.historychkBoxChecked;
    this.loadEmails(
      this.state.skip ?? 0,
      this.state.take ?? 0,
      this.sortValue,
      this.sortType,
      this.historychkBoxChecked
    );
  }
}
