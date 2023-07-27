import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'cms-medical-premiums-leave-page',
  templateUrl: './medical-premiums-leave-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsLeavePageComponent {
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
