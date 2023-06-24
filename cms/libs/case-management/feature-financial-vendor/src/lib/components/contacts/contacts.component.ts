import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { VendorContactsFacade } from '@cms/case-management/domain';
import { State } from '@progress/kendo-data-query';
@Component({
  selector: 'cms-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
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
}
