import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { VendorContactsFacade } from '@cms/case-management/domain';
import { State } from '@progress/kendo-data-query';
import { ColumnComponent, ColumnVisibilityChangeEvent } from '@progress/kendo-angular-grid';
@Component({
  selector: 'cms-contacts',
  templateUrl: './contacts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsComponent { 
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isContactsDetailShow = false;
  isContactsDeactivateShow = false;
  isContactsDeleteShow = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isContactsGridLoaderShow = false;
  public sortValue = this.contactsFacade.sortValue;
  public sortType = this.contactsFacade.sortType;
  public pageSizes = this.contactsFacade.gridPageSizes;
  public gridSkipCount = this.contactsFacade.skipCount;
  public sort = this.contactsFacade.sort;
  public state!: State;
  public columnState!:any
  contactsGridView$ = this.contactsFacade.contactsData$;

 
  public contactsActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
      click: (data: any): void => {
        this.clickOpenAddEditContactsDetails();
        console.log(data);
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate',
      icon: 'block',
      click: (data: any): void => {
        console.log(data);
        this.clickOpenDeactivateContactsDetails();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (data: any): void => {
        console.log(data);
        this.clickOpenDeleteContactsDetails();
      },
    },
  ];
  addRemoveColumns="Default Columns"
  columns : any = {
    clientFullName:"Client Name",
    officialIdFullName:"Name on Official ID",
    insuranceFullName:"Name on Primary Insurance Card",
    pronouns:"Pronouns",
    clientId:"Client ID",
    urn:"URN",
    preferredContact:"Preferred Contact",
    caseStatus:"Status",
    group:"Group",
    eilgibilityStartDate:"Eligibility Start Date",
    eligibilityEndDate:"Eligibility End Date",
    email:"Email",
    phone:"Phone",
    genders:"Gender",
    homeAddress:"Home Address",
    ssn:"SSN",
    insurancePolicyId:"Insurance Policy Id",
    assignedCw:"Assigned to",
    dateOfBirth:"Date Of Birth",
    caseManager:"Case Manager"
  }
  columnsReordered: boolean = false;
  selectedColumn!: any;
  filter : any = "";
  columnName: any = "";
  statusValue = null;


   /** Constructor **/
   constructor(private readonly contactsFacade: VendorContactsFacade) {}


   
  ngOnInit(): void {
    this.loadContactsListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  }

  // updating the pagination info based on dropdown selection
  pageSelectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
  }

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
  }
  loadContactsListGrid() {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.columnsReordered = false;
    this.contactsFacade.loadContactsListGrid();
  }
  clickOpenAddEditContactsDetails() {
    this.isContactsDetailShow = true;
  }

  clickCloseAddEditContactsDetails() {
    this.isContactsDetailShow = false;
  }

  clickOpenDeactivateContactsDetails() {
    this.isContactsDeactivateShow = true;
  }
  clickCloseDeactivateContacts() {
    this.isContactsDeactivateShow = false;
  }

  clickOpenDeleteContactsDetails() {
    this.isContactsDeleteShow = true;
  }
  clickCloseDeleteContacts() {
    this.isContactsDeleteShow = false;
  }
  columnReorder(event:any){
    this.columnsReordered = true;
  }
  public columnChange(e: any) {
    let event = e as ColumnVisibilityChangeEvent;
    const columnsRemoved = event?.columns.filter(x=> x.hidden).length
    const columnsAdded = event?.columns.filter(x=> x.hidden === false).length

  if (columnsAdded > 0) {
    this.addRemoveColumns = 'Columns Added';
  }
  else {
    this.addRemoveColumns = columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
  }

  event.columns.forEach(column => {
    if (column.hidden) {
      const field = (column as ColumnComponent)?.field;
      const mainFilters = this.columnState.filter.filters;

      mainFilters.forEach((filter:any) => {
          const filterList = filter.filters;

          const foundFilter = filterList.find((x: any) => x.field === field);

          if (foundFilter) {
            filter.filters = filterList.filter((x: any) => x.field !== field);
            this.clearSelectedColumn();
            this.contactsFacade.loadContactsListGrid();
          }
        });
      }
      if (!column.hidden) {
        let columnData = column as ColumnComponent;
        this.columns[columnData.field] = columnData.title;
      }

    });
  }
  private clearSelectedColumn() {
    this.selectedColumn = '';
    this.columnName = '';
    this.filter = '';
    this.columnState.searchValue = '';
    this.columnState.selectedColumn = '';
    this.columnState.columnName = '';
  }
}
