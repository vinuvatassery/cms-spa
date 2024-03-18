import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { CptCodePageComponent } from './container/cpt-code-page/cpt-code-page.component';
import { DrugsPageComponent } from './container/drugs-page/drugs-page.component';
import { HealthcareProviderPageComponent } from './container/healthcare-provider-page/healthcare-provider-page.component';
import { InsurancePlanPageComponent } from './container/insurance-plan-page/insurance-plan-page.component';
import { InsuranceProvidePageComponent } from './container/insurance-provide-page/insurance-provide-page.component';
import { InsuranceVendorsPageComponent } from './container/insurance-vendors-page/insurance-vendors-page.component';
import { ManufacturersPageComponent } from './container/manufacturers-page/manufacturers-page.component';
import { MedicalProvidersPageComponent } from './container/medical-providers-page/medical-providers-page.component';
import { PharmaciesPageComponent } from './container/pharmacies-page/pharmacies-page.component';
 
 

const routes: Routes = [
  {
    path: 'cpt-codes',
    component: CptCodePageComponent,
  }, 
  {
    path: 'hiv-care-provider',
    component: HealthcareProviderPageComponent,
  }, 
  {
    path: 'ins-plans',
    component: InsurancePlanPageComponent,
  }, 
  {
    path: 'ins-providers',
    component: InsuranceProvidePageComponent,
  }, 
  {
    path: 'ins-vendors',
    component: InsuranceVendorsPageComponent,
  }, 
  {
    path: 'manufacturer',
    component: ManufacturersPageComponent,
  }, 
  {
    path: 'medical-provider',
    component: MedicalProvidersPageComponent,
  }, 
  {
    path: 'pharmacies',
    component: PharmaciesPageComponent,
  }, 
  {
    path: 'drugs',
    component: DrugsPageComponent,
  }, 
  {
    path: '',
    redirectTo: 'drugs',
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemConfigFeatureServiceProviderRoutingModule {}
