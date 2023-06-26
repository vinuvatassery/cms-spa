/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  TemplateRef,
  Input,
  EventEmitter,
  ViewChild,
  Output,
  OnChanges,
 
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialVendorRefundFacade } from '@cms/case-management/domain'; 
import { DialogService } from '@progress/kendo-angular-dialog';
@Component({
  selector: 'cms-refund-process-list',
  templateUrl: './refund-process-list.component.html',
  styleUrls: ['./refund-process-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundProcessListComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @ViewChild('batchRefundConfirmationDialog', { read: TemplateRef })
  batchRefundConfirmationDialog!: TemplateRef<any>;
  @ViewChild('deleteRefundConfirmationDialog', { read: TemplateRef })
  deleteRefundConfirmationDialog!: TemplateRef<any>;
  private deleteRefundDialog: any;
  private batchConfirmRefundDialog: any;
  private addEditRefundFormDialog: any;
  isDeleteBatchClosed = false; 
  isProcessBatchClosed = false; 
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isVendorRefundProcessGridLoaderShow = false;
  public sortValue = this.financialVendorRefundFacade.sortValueRefundProcess;
  public sortType = this.financialVendorRefundFacade.sortType;
  public pageSizes = this.financialVendorRefundFacade.gridPageSizes;
  public gridSkipCount = this.financialVendorRefundFacade.skipCount;
  public sort = this.financialVendorRefundFacade.sortProcessList;
  public state!: State;
  vendorRefundProcessGridLists$ =
    this.financialVendorRefundFacade.vendorRefundProcessData$;

  public refundProcessMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'BATCH REFUNDS',
      icon: 'check',
      click: (data: any): void => { 
        if(!this.isProcessBatchClosed){
          this.isProcessBatchClosed = true;
          this.onBatchRefundClicked(this.batchRefundConfirmationDialog, data);
        }  
      },
    },

    {
      buttonType: 'btn-h-danger',
      text: 'DELETE REFUNDS',
      icon: 'delete',
      click: (data: any): void => { 
        if(!this.isDeleteBatchClosed){
          this.isDeleteBatchClosed = true; 
          this.onDeleteRefundOpenClicked(this.deleteRefundConfirmationDialog, data);
        }

      },
    },
  ];
  /** Constructor **/
  constructor(
    private dialogService: DialogService,
    private readonly financialVendorRefundFacade: FinancialVendorRefundFacade 
  ) {}

  ngOnInit(): void {
    this.loadVendorRefundProcessListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  }

  // updating the pagination info based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
  }

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
  }
  loadVendorRefundProcessListGrid() {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.financialVendorRefundFacade.loadVendorRefundProcessListGrid();
  }
  public onBatchRefundClicked(template: TemplateRef<unknown>, data:any): void {
    this.batchConfirmRefundDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
    // this.isStatusPeriodDetailOpened = true;
  }
  onModalBatchRefundModalClose(result: any) {
    if (result) {
      this.isProcessBatchClosed = false;
      this.batchConfirmRefundDialog.close();
    }
  }

  public onDeleteRefundOpenClicked(
    template: TemplateRef<unknown>, data:any
  ): void {
    this.deleteRefundDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
    // this.isStatusPeriodDetailOpened = true;
  }
  onModalDeleteRefundModalClose(result: any) {
    if (result) {
      this.isDeleteBatchClosed = false;
      this.deleteRefundDialog.close();
    }
  }


  onClickOpenAddEditRefundFromModal(template: TemplateRef<unknown>): void {
    this.addEditRefundFormDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-full add_refund_modal',
    });
    // this.isStatusPeriodDetailOpened = true;
  }
  onModalCloseAddEditRefundFormModal(result: any) {
    if (result) { 
      this.addEditRefundFormDialog.close();
    }
  }
   
}
