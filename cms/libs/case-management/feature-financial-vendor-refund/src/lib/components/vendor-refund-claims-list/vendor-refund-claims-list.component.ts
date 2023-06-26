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
  selector: 'cms-vendor-refund-claims-list',
  templateUrl: './vendor-refund-claims-list.component.html',
  styleUrls: ['./vendor-refund-claims-list.component.scss'],
})
export class VendorRefundClaimsListComponent {
  
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isVendorRefundProcessGridLoaderShow = false;
  public sortValue = this.financialVendorRefundFacade.sortValueClaims;
  public sortType = this.financialVendorRefundFacade.sortType;
  public pageSizes = this.financialVendorRefundFacade.gridPageSizes;
  public gridSkipCount = this.financialVendorRefundFacade.skipCount;
  public sort = this.financialVendorRefundFacade.sortClaimsList;
  public state!: State;
  claimsListData$ =
    this.financialVendorRefundFacade.claimsListData$;
     /** Constructor **/
  constructor(  private readonly financialVendorRefundFacade: FinancialVendorRefundFacade) {}

  ngOnInit(): void {
    this.loadClaimsListGrid();
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
  loadClaimsListGrid() {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.financialVendorRefundFacade.loadClaimsListGrid();
  }
}
