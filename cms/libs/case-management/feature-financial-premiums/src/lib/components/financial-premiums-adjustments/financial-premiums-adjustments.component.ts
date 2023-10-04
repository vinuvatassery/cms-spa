/** Angular **/
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import { GridFilterParam } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';

@Component({
    selector: 'cms-financial-premium-adjustment',
    templateUrl: './financial-premiums-adjustments.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumAdjustmentsComponent implements OnInit {
    /* Input Properties */
    @Input() adjustmentId!: string
    @Input() pageSizes: any;
    @Input() adjustments$!: any;
    @Input() adjustmentsLoader$!: any;

    /* Output Properties */
    @Output() loadAdjustmentsEvent = new EventEmitter<{ paymentId: string, params: GridFilterParam }>();

    /* Public properties */
    formUiStyle: UIFormStyle = new UIFormStyle();
    state!: State;
    sortValue:any;
    sortType:any;

    /* Lifecycle Events */
    ngOnInit(): void {
        this.state = {
            skip: 0,
            take: this.pageSizes[0]?.value,
            sort: [{ field: 'coverageStartDate', dir: 'desc' }]
            
          };
        this.loadAdjustments();
    }

    /* Public methods */
    dataStateChange(stateData: any): void {
        this.sortValue = stateData.sort[0]?.field ?? 'coverageStartDate';
        this.sortType = stateData.sort[0]?.dir ?? 'asc';
        this.state = stateData;
        this.loadAdjustments();
    }

    pageSelectionChange(data: any) {
        this.state.take = data.value;
        this.state.skip = 0;
        this.loadAdjustments();
    }

    /* Private Methods */
    loadAdjustments() {
        const params = new GridFilterParam(this.state?.skip ?? 0, this.state?.take ?? 0, this.sortValue, this.sortType);
        this.loadAdjustmentsEvent.emit({paymentId: this.adjustmentId, params: params});
    }
}