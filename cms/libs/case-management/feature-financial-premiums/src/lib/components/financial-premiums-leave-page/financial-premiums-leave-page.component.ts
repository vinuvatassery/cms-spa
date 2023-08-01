import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'cms-financial-premiums-leave-page',
  templateUrl: './financial-premiums-leave-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsLeavePageComponent {
  @Output() modalLeavePageCloseClicked = new EventEmitter();
  premiumsType: any;
  constructor(private route: Router, public activeRoute: ActivatedRoute ) {}
  closeLeavePageClicked() {
    this.modalLeavePageCloseClicked.emit(true);
  }
  navToBatchDetails(event : any){  
    this.route.navigate(['/financial-management/' + this.premiumsType] );  
    this.closeLeavePageClicked();
  }
}
