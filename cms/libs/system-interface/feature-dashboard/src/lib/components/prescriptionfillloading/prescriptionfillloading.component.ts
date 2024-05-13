import {
  Component,
} from '@angular/core';
import { SystemInterfaceDashboardFacade } from '@cms/system-interface/domain';
@Component({
  selector: 'cms-prescriptionfillloading',
  templateUrl: './prescriptionfillloading.component.html',
  styleUrls: ['./prescriptionfillloading.component.scss'],
})
export class PrescriptionfillloadingComponent {
  isloader=true;
  prescriptionsFills:any;
  constructor(private systemInterfaceDashboardFacade:SystemInterfaceDashboardFacade)
  {
    this.systemInterfaceDashboardFacade.prescriptionsFillsCard();
    this.systemInterfaceDashboardFacade.prescriptionsFills$.subscribe((res:any)=>{
    this.prescriptionsFills=res;
    this.isloader=false;
    });
  }

}
