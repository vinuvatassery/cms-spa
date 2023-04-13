/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';

import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { first, Subject } from 'rxjs';
@Component({
  selector: 'case-management-case-manager-list',
  templateUrl: './case-manager-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseManagerListComponent implements OnChanges {
  /******* output events */
  @Output() loadCasemanagersGridEvent = new EventEmitter<any>();
  @Output() deleteCasemanagersGridEvent = new EventEmitter<string>();
  @Output() searchTextEvent = new EventEmitter<string>();
  @Output() getExistingCaseManagerEvent = new EventEmitter<string>();
  @Output() addExistingCaseManagerEvent = new EventEmitter<string>();
  @Output() loadprofilePhotoEvent = new EventEmitter<string>();

  /** Input properties **/
  @Input() getCaseManagers$: any;
  @Input() showAddNewManagerButton$: any;
  @Input() getManagerUsers$: any;
  @Input() selectedCaseManagerDetails$: any;
  @Input() assignCaseManagerStatus$: any;
  @Input() removeCaseManager$: any;
  @Input() userImage$: any;
  @Input() managementTab: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;

  /** Public properties **/
  public formUiStyle: UIFormStyle = new UIFormStyle();
  selectedCustomCaseManagerName!: string;
  editformVisibleSubject = new Subject<boolean>();
  editformVisible$ = this.editformVisibleSubject.asObservable();

  existingCaseManagerData!: any;
  isOpenedCaseManagerSearch = false;
  editButtonEmitted = false;
  removeButttonEmitted = false;
  unAssignButttonEmitted = false;
  reAssignButttonEmitted = false;
  editDtButttonEmitted = false;
  showDeleteConfirmation = false;
  showEditpopup = false;
  deleteCaseManagerCaseId!: string;
  isEditSearchCaseManagerProvider = false;
  selectedCaseManagerId!: string;
  gridHoverDataItem!: any;
  public state!: State;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  showReAssignConfirmation = false;
  showUnAssignConfirmation = false;
  showReferralConfirmation = false;
  showDateChangePopup = false;

  public newAppActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Case Manager',
      icon: 'edit',
      buttonName: 'editMngr',
      click: (clientCaseId: string, caseManagerId: string): void => {
        if (!(this.editButtonEmitted ?? false)) {
          this.editButtonEmitted = true;
          this.deleteCaseManagerCaseId = clientCaseId;
          this.onOpenManagerSearchClicked(clientCaseId, caseManagerId, true);
        }
      },
    },

    {
      buttonType: 'btn-h-danger',
      text: 'Remove Case Manager',
      icon: 'delete',
      buttonName: 'removeMngr',
      click: (clientCaseId: string, caseManagerId: string): void => {
        if (this.removeButttonEmitted === false) {
          this.deleteCaseManagerCaseId = clientCaseId;
          this.selectedCaseManagerId = caseManagerId
          this.onremoveManagerClicked();
          this.removeButttonEmitted = true;
        }
      },
    },
  ];
  public tabActions = [
    {
      buttonType: 'btn-h-danger',
      text: 'Un Assign Case Manager',
      icon: 'delete',
      buttonName: 'unAssignMngr',
      click: (clientCaseId: string, caseManagerId: string): void => {
        if (this.unAssignButttonEmitted === false) {
          this.deleteCaseManagerCaseId = clientCaseId;        
          this.selectedCaseManagerId = caseManagerId
          this.onUnAssignManagerClicked();
          this.unAssignButttonEmitted = true;
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Re Assign Case Manager',
      icon: 'delete',
      buttonName: 'reAssignMngr',
      click: (clientCaseId: string, caseManagerId: string): void => {
        if (this.reAssignButttonEmitted === false) {
          this.deleteCaseManagerCaseId = clientCaseId;
          this.selectedCaseManagerId = caseManagerId
          this.onReAssignManagerClicked();
          this.reAssignButttonEmitted = true;
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Edit Dates',
      icon: 'delete',
      buttonName: 'editDatesMngr',
      click: (clientCaseId: string, caseManagerId: string): void => {
        if (this.editButtonEmitted === false) {
          this.deleteCaseManagerCaseId = clientCaseId;
          this.selectedCaseManagerId = caseManagerId
          this.onremoveManagerClicked();
          this.editButtonEmitted = true;
        }
      },
    },
  ];

  /** Lifecycle hooks **/

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadCaseManagerssList();
  }

  /** Private methods **/

  private loadCaseManagerssList(): void {
    this.loadManagers(
      this.state.skip ?? 0,
      this.state.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadManagers(
    skipcountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    const gridDataRefinerValue = {
      skipCount: skipcountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadCasemanagersGridEvent.next(gridDataRefinerValue);
  }

  onManagerHover(dataItem: any) {
    this.gridHoverDataItem = dataItem;
  }

  onOpenManagerSearchClicked(
    clientCaseId: string,
    caseManagerId: string,
    isEdit: boolean
  ) {
    this.selectedCustomCaseManagerName = '';

    this.isEditSearchCaseManagerProvider = isEdit;
    this.selectedCaseManagerId = caseManagerId;
    if (isEdit === true) {
      this.getExistingCaseManagerEvent.emit(this.selectedCaseManagerId);
      this.onExistCaseManagerFormLoad();
    } else {
      this.isOpenedCaseManagerSearch = true;
      this.editformVisibleSubject.next(this.isOpenedCaseManagerSearch);
    }
  }
  onUnAssignManagerClicked() {
    this.showUnAssignConfirmation = true;
  }

  onReAssignManagerClicked() {
    this.showReAssignConfirmation = true;
  }

  onReferralAssignManagerClicked() {
    this.showReferralConfirmation = true;
  }

  onDateChangeClicked() {
    this.showDateChangePopup = true;
  }

  onUnAssignManagerCloseClicked() {
    this.showUnAssignConfirmation = false;
    this.unAssignButttonEmitted = false;
  }

  onReAssignConfirmCloseClicked() {
    this.showReAssignConfirmation = false;
    this.reAssignButttonEmitted = false;
  }

  onReferralAssignManagerCloseClicked() {
    this.showReferralConfirmation = false;
  }

  onDateChangeCloseClicked() {
    this.showDateChangePopup = false;
    this.editButtonEmitted = false;
  }

  onremoveManagerClicked() {
    this.showDeleteConfirmation = true;
  }

  onDeleteConfirmCloseClicked() {
    this.showDeleteConfirmation = false;
    this.removeButttonEmitted = false;
  }

  onDeleteConfirmHandle(data: any) {
    if (!(data?.confirm ?? false)) {
      this.onDeleteConfirmCloseClicked();
      this.onUnAssignManagerCloseClicked()
    } else {
      data.deleteCaseManagerCaseId =this.deleteCaseManagerCaseId 
      this.deleteCasemanagersGridEvent.emit(data);
      this.removeCaseManager$
        .pipe(first((removeResponse: any) => removeResponse != null))
        .subscribe((removeResponse: any) => {
          if (removeResponse === true) {
            this.loadCaseManagerssList();
            this.onDeleteConfirmCloseClicked();
            this.onUnAssignManagerCloseClicked()
          }
        });
    }
  }

  handleManagerRemove(caseManagerCaseId: any) {
    this.onCloseCsManagerSearchClicked();
    this.onremoveManagerClicked();
  }
  onCloseCsManagerSearchClicked() {
    this.editButtonEmitted = false;
    this.editformVisibleSubject.next(false);
  }

  searchTextEventHandleer($event: any) {
    this.searchTextEvent.next($event);
  }

  pageselectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadCaseManagerssList();
  }

  reAssignConfimEvent(data: any) {
    if (data?.confirm === true) 
    {
      this.addExistingCaseManagerEventEventHandler(data);
    } 
    else 
    {
      this.onReAssignConfirmCloseClicked();
    }
  }

  addExistingCaseManagerEventEventHandler($event: any) {
    this.addExistingCaseManagerEvent.emit($event);

    this.assignCaseManagerStatus$
      .pipe(first((addResponse: any) => addResponse != null))
      .subscribe((addResponse: any) => {
        if (addResponse ?? false) {
          this.loadCaseManagerssList();
          this.onCloseCsManagerSearchClicked();
          this.onReAssignConfirmCloseClicked();
        }
      });
  }

  onExistCaseManagerFormLoad() {
    this.selectedCaseManagerDetails$
      ?.pipe(
        first(
          (existcsManagerData: any) => existcsManagerData?.loginUserId != null
        )
      )
      .subscribe((existcsManagerData: any) => {
        if (existcsManagerData?.loginUserId) {
          this.existingCaseManagerData = {
            assignedcaseManagerId: existcsManagerData?.loginUserId,
          };
          this.selectedCustomCaseManagerName =
            existcsManagerData?.fullName +
            ' ' +
            existcsManagerData?.pOrNbr +
            ' ' +
            existcsManagerData?.phoneNbr;
          this.isOpenedCaseManagerSearch = true;
          this.editformVisibleSubject.next(this.isOpenedCaseManagerSearch);
        }
      });
  }

  loadprofilePhotoEventHandler(caseManagerId: string) {
    this.loadprofilePhotoEvent.emit(caseManagerId);
  }
}
