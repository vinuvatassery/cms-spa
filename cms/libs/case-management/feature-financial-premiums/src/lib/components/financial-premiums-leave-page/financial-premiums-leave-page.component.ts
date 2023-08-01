import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'cms-financial-premiums-leave-page',
  templateUrl: './financial-premiums-leave-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsLeavePageComponent {
  @Output() modalLeavePageCloseClicked = new EventEmitter();

  constructor(private route: Router ) {}
  closeLeavePageClicked() {
    this.modalLeavePageCloseClicked.emit(true);
  }
  navToBatchDetails(event : any){  
    this.route.navigate(['/financial-management/insurance-premiums'] );
    this.closeLeavePageClicked();
  }
}
