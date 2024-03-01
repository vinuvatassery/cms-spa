/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
/** External Libraries **/
import { State } from '@progress/kendo-data-query';
/** Internal Libraries **/
import { ClientEmployer, EmploymentFacade, CaseFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { UserManagementFacade } from '@cms/system-config/domain';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'case-management-employer-list',
  templateUrl: './employer-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerListComponent implements OnInit, OnChanges {
  /** Input properties **/
  @Input() data!: any;
  @Input() employment$: any;
  @Input() isGridLoaderShow: any;
  @Input() clientCaseEligibilityId: any;
  @Input() clientId: any;
  @Input() clientCaseId: any;
  @Input() isClientProfileTab: boolean = false;
  @Input() enableAddButton: boolean = true;
  @Output() loadEmploymentsEvent = new EventEmitter<any>();
  @Output() addUpdateEmploymentEvent = new EventEmitter<any>();
  /** Public properties **/
  filterable = false;
  isAdd = true;
  isRemoveEmployerConfirmationPopupOpened = false;
  isEmployerOpened = false;
  selectedEmployer: ClientEmployer = new ClientEmployer();
  employmentValid$ = this.employmentFacade.employmentValid$;
  isEmployerAvailable:boolean = true;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public sortValue = this.employmentFacade.sortValue;
  public sortType = this.employmentFacade.sortType;
  public pageSizes = this.employmentFacade.gridPageSizes;
  public gridSkipCount = this.employmentFacade.skipCount;
  public sort = this.employmentFacade.sort;
  public state!: State;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
  employerProfilePhoto$ = this.employmentFacade.employerProfilePhotoSubject;
  public actions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Employer',
      icon: 'edit',
      type: 'edit',
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Employer',
      icon: 'delete',
      type: 'delete',
    },
  ];

  /** Constructor **/
  constructor(private readonly employmentFacade: EmploymentFacade,private readonly cdr: ChangeDetectorRef,private caseFacade: CaseFacade,) {}

  /** Lifecycle hooks **/

  ngOnInit(): void {
    this.employmentValid$.subscribe(response=>{
      this.isEmployerAvailable = response;
      this.cdr.detectChanges();
    })
  }

  ngOnChanges(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadEmployments();
  }

// Grid More action clicl function
  onEmployerActionClicked(
    selectedEmployer: ClientEmployer,
    modalType: string = ''
  ) {
    this.selectedEmployer = selectedEmployer;
    if (modalType == 'edit') {
      this.isEmployerOpened = true;
      this.isAdd = false;
    }
    if (modalType == 'delete') {
      this.isRemoveEmployerConfirmationPopupOpened = true;
    }
  }

// updating the pagination infor based on dropdown selection
  pageselectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadEmployments();
  }

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    if(stateData.sort[0]?.field) {
        if(stateData.sort[0].field == 'effectiveDate') {
          this.sortValue = 'dateOfHire';
        }
        else {
          this.sortValue = stateData.sort[0]?.field;
        }
    }
    
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.loadEmployments();
  }
  // Loading the grid data based on pagination
  private loadEmployments(): void {
    this.loadEmploymentsLists(
      this.state.skip ?? 0,
      this.state.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }

  loadEmploymentsLists(
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
    this.loadEmploymentsEvent.next(gridDataRefinerValue);
  }
  // updating the grid data
  updateEmploymentHandle(employements: any) {
    this.loadEmployments();
  }

  // employer detail popup close handler
  onEmployerClosed() {
      this.isEmployerOpened = false;
  }
  // employer detail popup show handler
  onEmployerClicked(isEmployerAdd: boolean) {
      this.isEmployerOpened = true;
      this.isAdd = isEmployerAdd;
  }
  // employer detail popup show/hide handler
  receiveDetailFromEmpDetails($event: boolean) {
        this.isEmployerOpened = $event;
  }
  // employer remove popup close
  onRemoveEmployerConfirmationClosed() {
        this.isRemoveEmployerConfirmationPopupOpened = false;
  }
}
