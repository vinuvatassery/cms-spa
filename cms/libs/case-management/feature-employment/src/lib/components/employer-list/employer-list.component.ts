/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
/** Enums **/
import { ScreenType } from '@cms/case-management/domain';
/** Facades **/
import { ClientEmployer, EmploymentFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { SortDescriptor, State } from '@progress/kendo-data-query';
@Component({
  selector: 'case-management-employer-list',
  templateUrl: './employer-list.component.html',
  styleUrls: ['./employer-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployerListComponent implements OnInit {
  /** Input properties **/
  @Input() data!: any;
  @Input() employment$: any;
  @Input() isGridLoaderShow: any;
  @Output() loadEmploymentsEvent = new EventEmitter<any>();
  @Output() addUpdateEmploymentEvent = new EventEmitter<any>();
  /** Public properties **/
  isAddEmployerButtonDisplayed!: boolean;
  isAdd = true;
  isRemoveEmployerConfirmationPopupOpened = false;
  isEmployerOpened = false;
  selectedEmployer: ClientEmployer = new ClientEmployer();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public sortValue = this.employmentFacade.sortValue;
  public sortType = this.employmentFacade.sortType;
  public pageSizes = this.employmentFacade.gridPageSizes;
  public sort = this.employmentFacade.sort;
  public state!: State;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';

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
  constructor(private readonly employmentFacade: EmploymentFacade) {}

  /** Lifecycle hooks **/
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: 5,
      sort: this.sort,
    };
    this.loadEmployments();
  }
  ngOnInit(): void {
    this.addEmployerButtonDisplay();
    this.loadEmployments();
  }

  
  receiveDetailFromEmpDetails($event: boolean) {
    this.isEmployerOpened = $event;
  }

  /** Private methods **/
  pageselectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadEmployments();
  }
  private addEmployerButtonDisplay() {
    if (this.data === ScreenType.Case360Page) {
      this.isAddEmployerButtonDisplayed = false;
    } else {
      this.isAddEmployerButtonDisplayed = true;
    }
  }

  /** Internal event methods **/
  onEmployerClosed() {
    this.isEmployerOpened = false;
  }

  onEmployerClicked(isEmployerAdd: boolean) {
    this.isEmployerOpened = true;
    this.isAdd = isEmployerAdd;
  }

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

  updateEmploymentHandle(employements: any) {
    this.loadEmployments();
  }
  onRemoveEmployerConfirmationClosed() {
    this.isRemoveEmployerConfirmationPopupOpened = false;
  }

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.loadEmployments();
  }

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
}
