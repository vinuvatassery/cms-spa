import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FinancialPageComponent } from "./containers/financial-page/financial-page.component";

const routes: Routes = [
    {
        path: '',
        component: FinancialPageComponent,   
        data: {
          title: '',
        }, 
        children: [
            {
                path: 'vendors',
                loadChildren: () =>
                  import('@cms/case-management/feature-financial-vendor').then(
                    (m) => m.CaseManagementFeatureFinancialVendorModule
                  ),
                data: {
                  title: '',
                },
              },
              {
                path: 'replenishment',
                loadChildren: () =>
                  import('@cms/case-management/feature-financial-replenishment').then(
                    (m) => m.CaseManagementFeatureFinancialReplenishmentModule
                  ),
                data: {
                  title: '',
                },
              }
              ,
              {
                path: 'vendor-refund',
                loadChildren: () =>
                  import('@cms/case-management/feature-financial-vendor-refund').then(
                    (m) => m.CaseManagementFeatureFinancialVendorRefundModule
                  ),
                data: {
                  title: '',
                },
              }
              ,
              {
                path: 'medical-claims',
                loadChildren: () =>
                  import('@cms/case-management/feature-financial-medical-claims').then(
                    (m) => m.CaseManagementFeatureFinancialMedicalClaimsModule
                  ),
                data: {
                  title: '',
                },
              }
              ,
              {
                path: 'insurance-premiums',
                loadChildren: () =>
                  import('@cms/case-management/feature-financial-insurance-premiums').then(
                    (m) => m.CaseManagementFeatureFinancialInsurancePremiumsModule
                  ),
                data: {
                  title: '',
                },
              }
              ,
              {
                path: 'pharmacy-claims',
                loadChildren: () =>
                  import('@cms/case-management/feature-financial-pharmacy-claims').then(
                    (m) => m.CaseManagementFeatureFinancialPharmacyClaimsModule
                  ),
                data: {
                  title: '',
                },
              }
        ]
    }
]

@NgModule({
    imports: [CommonModule,
      RouterModule.forChild(routes),
    ],  
    exports: [RouterModule],
  })

  
export class  CaseManagementFeatureFinancialManagementRoutingModule {}