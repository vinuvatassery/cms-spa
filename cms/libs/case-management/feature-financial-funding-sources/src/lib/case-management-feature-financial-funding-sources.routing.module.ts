import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { FundingSourcePageComponent } from './containers/funding-source-page/funding-source-page.component';
 
const routes = [
  {
    path: '',
    component: FundingSourcePageComponent,
    data: {
      title: '',
    },
  },
  
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],

  exports: [RouterModule],
})
export class CaseManagementFeatureFinancialFundingSourcesRoutingModule { }
