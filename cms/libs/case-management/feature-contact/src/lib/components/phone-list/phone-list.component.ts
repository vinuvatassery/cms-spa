/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
/** Facades **/
import { State } from '@progress/kendo-data-query';
import { BehaviorSubject, first, Subject, Subscription } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { UserManagementFacade } from '@cms/system-config/domain';
import { CaseFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-phone-list',
  templateUrl: './phone-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneListComponent implements OnChanges, OnDestroy {
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() clientPhonesData$: any;
  @Input() clientPhone$: any;
  @Input() lovClientPhoneDeviceType$: any;
  @Input() addClientPhoneResponse$: any;
  @Input() preferredClientPhone$: any;
  @Input() deactivateClientPhone$: any;
  @Input() removeClientPhone$: any;
  @Input() deactivateAndAddClientPhone$: any;
  @Input() phoneListProfilePhoto$!: any;
  @Output() loadClientPhonesListEvent = new EventEmitter<any>();
  @Output() addClientPhoneEvent = new EventEmitter<any>();
  @Output() loadDeviceTypeLovEvent = new EventEmitter<any>();
  @Output() loadSelectedPhoneEvent = new EventEmitter<any>();
  @Output() preferredClientPhoneEvent = new EventEmitter<any>();
  @Output() deactivateClientPhoneEvent = new EventEmitter<any>();
  @Output() removeClientPhoneEvent = new EventEmitter<any>();
  @Output() reloadEmailsEvent = new EventEmitter();
  @Output() deactivateAndAddClientPhone = new EventEmitter<any>();
  /** Public properties **/
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isEditPhoneNumber!: boolean;
  isDeactivateFlag = false;
  isPhoneNumberDetailPopup = false;
  isDeactivatePhoneNumberPopup = false;
  deletebuttonEmitted = false;
  editbuttonEmitted = false;
  activateButtonEmitted = false;
  preferredButtonEmitted = false;
  subscriptionData!: Subscription;
  selectedPhoneData!: any;
  editformVisibleSubject = new Subject<boolean>();
  gridPhoneDataSubject = new Subject<any>();
  editformVisible$ = this.editformVisibleSubject.asObservable();
  gridPhoneData$ = this.gridPhoneDataSubject.asObservable();
  isOpenedPhoneEdit = false;
  isOpenedDeleteConfirm = false;
  selectedclientPhoneId!: string;
  public state!: State;
  historychkBoxChecked = false;
  loader = new BehaviorSubject(false);
  hasPhoneDeletePermission =false;
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
  userPhoneProfilrPhotoSubject = new Subject<any>();
  clientPhonesDataSubscription = new Subscription();
  // gridOption: Array<any> = [{ text: 'Options' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public gridOption = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Phone Number',
      buttonName: 'edit',
      icon: 'edit',
      click: (clientPhone: any): void => {
        if (!this.editbuttonEmitted) {
          this.selectedclientPhoneId = '';
          this.editbuttonEmitted = true;
          this.onPhoneNumberDetailClicked(true, clientPhone.clientPhoneId);
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Make Preferred',
      icon: 'star',
      buttonName: 'preferred',
      click: (clientPhone: any): void => {
        if (!this.preferredButtonEmitted) {
          this.selectedclientPhoneId = '';
          this.preferredButtonEmitted = true;
          this.onPreferredPhoneClicked(clientPhone.clientPhoneId);
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate Phone',
      icon: 'block',
      buttonName: 'deactivate',
      click: (clientPhone: any): void => {
        if (!this.activateButtonEmitted) {
          this.selectedclientPhoneId = '';
          this.activateButtonEmitted = true;
          this.onDeactivatePhoneNumberClicked(clientPhone);
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Phone',
      icon: 'delete',
      buttonName: 'delete',
      click: (clientPhone: any): void => {
        if (!this.deletebuttonEmitted) {
          this.deletebuttonEmitted = true;
          this.onRemoveClick(clientPhone.clientPhoneId);
        }
      },
    },
  ];
/** Constructor**/
 constructor(
  private readonly userManage: UserManagementFacade,
  private caseFacade: CaseFacade,
  private readonly cdr:ChangeDetectorRef
) {}
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadClientPhonesList();
    this.hasPhoneDeletePermission = this.userManage.hasPermission(["Client_Profile_Client_ContactInfo_Phone_Delete"]);
  }
  pageselectionchange(data: any) {
    this.loader.next(true);
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadClientPhonesList();
  }

  ngOnDestroy(): void {
    this.clientPhonesDataSubscription?.unsubscribe();
  }
  /** Private methods **/

  private loadClientPhonesList(): void {
    this.loadPhones(
      this.state.skip ?? 0,
      this.state.take ?? 0,
      this.sortValue,
      this.sortType,
      false
    );
  }
  loadPhones(
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
    this.gridDataHandle();
    this.loadClientPhonesListEvent.next(gridDataRefinerValue);
  }

  /** grid event methods **/

  public dataStateChange(stateData: any): void {    
    this.loader.next(true);
    this.sort = stateData.sort;
    this.sortValue = stateData?.sort[0]?.field ?? 'deviceTypeCode';
    this.sortType = stateData?.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.loadClientPhonesList();
  }

  /** Internal event methods **/
reloadEmails()
{
this.reloadEmailsEvent.emit();  
}

  gridDataHandle() {
    this.clientPhonesDataSubscription = this.clientPhonesData$.subscribe((data: any) => {
      this.gridPhoneDataSubject.next(data); 
      if (data?.total >= 0 || data?.total === -1) {
        this.loader.next(false);
      }
    });
  }

  onPhoneNumberDetailClosed() {
    this.editbuttonEmitted = false;
    this.isPhoneNumberDetailPopup = false;
    this.isOpenedPhoneEdit = false;
    this.editformVisibleSubject.next(this.isOpenedPhoneEdit);
    this.activateButtonEmitted = false;
    this.isDeactivateFlag = false;
  }

  onPhoneNumberDetailClicked(editValue: boolean, clientPhoneId: string) {
    this.isEditPhoneNumber = editValue;
    if (clientPhoneId) {
      this.loadSelectedPhoneEvent.emit(clientPhoneId);
      this.onSelectedPhoneFormLoad();
    } else {
      this.isOpenedPhoneEdit = true;
      this.editformVisibleSubject.next(this.isOpenedPhoneEdit);
    }
  }

  onDeactivatePhoneNumberClosed() {
    this.isDeactivatePhoneNumberPopup = false;
    this.activateButtonEmitted = false;
    this.isDeactivateFlag = false;
  }

  addClientPhoneHandle(phoneData: any): void {
    this.editbuttonEmitted = true;
    this.addClientPhoneEvent.emit(phoneData);

    this.addClientPhoneResponse$
      .pipe(first((addResponse: any) => addResponse != null))
      .subscribe((addResponse: any) => {
        if (addResponse === true) {
          this.onPhoneNumberDetailClosed();
          this.loader.next(true);
          this.loadClientPhonesList();
          if(phoneData?.preferredFlag === 'Y')
          {
          this.reloadEmails()
          }
        }
        else{
          this.loader.next(false);
        }

      });
  }

  loadDeviceTypeLovHandle() {
    this.loadDeviceTypeLovEvent.emit();
  }

  onSelectedPhoneFormLoad() {
    this.subscriptionData = this.clientPhone$
      ?.pipe(first((phoneData: any) => phoneData?.clientPhoneId != null))
      .subscribe((phoneData: any) => {
        if (phoneData?.clientPhoneId) {
          this.selectedPhoneData = {
            clientPhoneId: phoneData?.clientPhoneId,
            phoneNbr: phoneData?.phoneNbr,
            detailMsgConsentFlag: phoneData?.detailMsgConsentFlag,
            deviceTypeCode: phoneData?.deviceTypeCode,
            smsTextConsentFlag: phoneData?.smsTextConsentFlag,
            preferredFlag: phoneData?.preferredFlag,
            otherPhoneNote: phoneData?.otherPhoneNote,
            isDeleted : phoneData?.isDeleted
          };
          this.isOpenedPhoneEdit = true;
          this.editformVisibleSubject.next(this.isOpenedPhoneEdit);
        }
      });
  }

  onPreferredPhoneClicked(clientPhoneId: string) {
    this.loader.next(true);
    this.preferredClientPhoneEvent.emit(clientPhoneId);
    this.preferredClientPhone$
      .pipe(first((Response: any) => Response != null))
      .subscribe((Response: any) => {
        if (Response === true) {
          this.preferredButtonEmitted = false;
          this.loadClientPhonesList();
          this.reloadEmails()
        }
      });
  }

  handleAcceptPhoneRemove(isDelete: boolean) {
    if (isDelete) {
      this.deletebuttonEmitted = false;
      this.removeClientPhoneEvent.emit(this.selectedclientPhoneId);

      this.removeClientPhone$
        .pipe(first((deleteResponse: any) => deleteResponse != null))
        .subscribe((deleteResponse: any) => {
          if (deleteResponse ?? false) {
            this.loadClientPhonesList();
          }
        });
    }
    this.onDeleteConfirmCloseClicked();
  }

  onDeleteConfirmCloseClicked() {
    this.deletebuttonEmitted = false;
    this.isOpenedDeleteConfirm = false;
  }

  onRemoveClick(clientPhoneId: string) {
    this.isOpenedDeleteConfirm = true;
    this.selectedclientPhoneId = clientPhoneId;
  }

  handleAcceptPhoneDeactivate(isDeactivate: boolean) {
    if (isDeactivate) {
      this.loader.next(true);
      this.deletebuttonEmitted = false;
      this.deactivateClientPhoneEvent.emit(this.selectedclientPhoneId);

      this.deactivateClientPhone$
        .pipe(first((deactResponse: any) => deactResponse != null))
        .subscribe((deactResponse: any) => {
          this.isDeactivateFlag = false;
          if (deactResponse ?? false) {
            this.loadClientPhonesList();
          }
        });
    }
    this.onDeactivatePhoneNumberClosed();
  }
  onDeactivatePhoneNumberClicked(clientPhone: any) {
    if (clientPhone.preferredFlag === "Y") {      
      this.isDeactivateFlag = true;
      this.onPhoneNumberDetailClicked(false, clientPhone.clientPhoneId);
    }
    else {
      this.isDeactivatePhoneNumberPopup = true;
      this.selectedclientPhoneId = clientPhone.clientPhoneId;
    }
  }

  onhistorychkBoxChanged() {
    this.historychkBoxChecked = !this.historychkBoxChecked;
    this.state.skip = 0
    this.loadPhones(
      this.state.skip ?? 0,
      this.state.take ?? 0,
      this.sortValue,
      this.sortType,
      this.historychkBoxChecked
    );
    this.loader.next(true);
  }

  phoneDeactivateandAddNewPhoneHandle(phoneData: any) {
    this.deactivateAndAddClientPhone.emit(phoneData);
    this.deactivateAndAddClientPhone$
      .pipe(first((response: any) => response != null))
      .subscribe((deleteResponse: any) => {
        if (deleteResponse ?? false) {
          this.onPhoneNumberDetailClosed();
          this.loadClientPhonesList();
        }
        this.isDeactivateFlag = false;
      });
  }
}
