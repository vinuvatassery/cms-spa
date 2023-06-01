import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes} from '@angular/router';
import { DentalPremiumsPageComponent } from './containers/dental-premiums/dental-premiums-page.component';

const routes : Routes=[
  {
    path: '',
    component: DentalPremiumsPageComponent,
    data: {
      title: '',
    },
  }
];

@NgModule({
  imports: [
    CommonModule, 
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class CaseManagementFeatureFinancialDentalPremiumsRoutingModule {}
