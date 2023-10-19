import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'cms-financial-premiums-leave-page',
  templateUrl: './financial-premiums-leave-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsLeavePageComponent {
  @Output() modalLeavePageCloseClicked = new EventEmitter();
  @Input() premiumsType: any;
  @Input() paymentRequestBatchId: any;
  constructor(private route: Router, public activeRoute: ActivatedRoute ) {}
  closeLeavePageClicked() {
    this.modalLeavePageCloseClicked.emit(true);
  }
  navToBatchDetails(event : any){  
     this.route.navigate([`/financial-management/premiums/${this.premiumsType}/batch`],
    { queryParams :{bid: this.paymentRequestBatchId}});
    this.closeLeavePageClicked();
  }
}
