import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'cms-income-inclusions-exclusions-list',
  templateUrl: './income-inclusions-exclusions-list.component.html',
  styleUrls: ['./income-inclusions-exclusions-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IncomeInclusionsExclusionsListComponent implements OnInit {
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  isIncomeInclusionsExclusionsDetailPopup = false;
  ddlColumnFilters$ = this.userManagementFacade.ddlColumnFilters$;
  clientProfilIncomeInclusionsExlusions$ =
    this.userManagementFacade.clientProfilIncomeInclusionsExlusions$;
    popupClassAction = 'TableActionPopup app-dropdown-action-list';


    public sort: SortDescriptor[] = [];
    gridConfiguration = {
      pageSize: 10,
      skip: 0,
      pageable: true,
      reorderable: true,
      resizable: true,
      sortable: true,
      sort: this.sort,
      columnMenu: true,
      pageChange: 0.55,
    };
  
    // gridColumns = [
      
    //   {
    //     field: 'inclusions',
    //     title: 'Inclusions/Exclusions',
    //     width: '130',
    //     sticky: false,
    //     format: 'item.format',
    //     filter: true,
    //     sortable: true,
    //     fieldType: 'text',
    //   },
      
     
    //   {
    //     field: 'lastModified',
    //     title: 'Last Modified',
    //     width: '130',
    //     sticky: false,
    //     format: 'item.format',
    //     filter: true,
    //     sortable: true,
    //     fieldType: 'date',
    //   },
    //   {
    //     field: 'modifiedBy',
    //     title: 'Modified by',
    //     width: '100',
    //     sticky: false,
    //     format: 'item.format',
    //     filter: true,
    //     sortable: true,
    //     fieldType: 'profilecard',
    //   },
      
      
    //   {
    //     field: 'options',
    //     title: '',
    //     width: '50',
    //     sticky: true,
    //     filter: false,
    //     sortable: false,
    //     fieldType: 'actions',
    //   },
    // ];
  
  
  
    public girdMoreActionsList = [
      {
        buttonType:"btn-h-primary",
        text: "Edit",
        icon: "edit",
        click: (): void => {
           this.onIncomeInclusionExclusionDetailClicked();
        },
      }, 
      
   
    ];
  constructor(private readonly userManagementFacade: UserManagementFacade) { }

  ngOnInit(): void {
    this.loadDdlColumnFilters();
    this.loadIncomeInclusionsExlusionsList();
  }
   /** Private methods **/
   private loadDdlColumnFilters() {
    this.userManagementFacade.loadDdlColumnFilters();
  }

  private loadIncomeInclusionsExlusionsList() {
    this.userManagementFacade.loadIncomeInclusionsExlusionsList();
  }
   /** Internal event methods **/
   onCloseIncomeInclusionsExclusionsDetailClicked() {
  this.isIncomeInclusionsExclusionsDetailPopup = false;
}
onIncomeInclusionExclusionDetailClicked() {
  this.isIncomeInclusionsExclusionsDetailPopup = true;
}

}
