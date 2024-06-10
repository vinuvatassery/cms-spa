import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeMainRouterPageComponent } from './containers/home-main-router-page/home-main-router-page.component';
const routes: Routes = [
  {
    path: '',
    component: HomeMainRouterPageComponent,
    data: {
      title: null,
    },
    children: [
      {
        path: 'cases',
        loadChildren: () =>
          import('@cms/system-config/feature-cases').then(
            (m) => m.SystemConfigFeatureCasesModule
          ),
    
      },
      {
        path: 'client-profile',
        loadChildren: () =>
          import('@cms/system-config/feature-client-profile-management').then(
            (m) => m.SystemConfigFeatureClientProfileManagementModule
          ),
    
      },
      {
        path: 'communication',
        loadChildren: () =>
          import('@cms/system-config/feature-communication').then(
            (m) => m.SystemConfigFeatureCommunicationModule
          ),
    
      },
      {
        path: 'financials',
        loadChildren: () =>
          import('@cms/system-config/feature-financials').then(
            (m) => m.SystemConfigFeatureFinancialsModule
          ),
     
      },
      {
        path: 'housing-coordination',
        loadChildren: () =>
          import(
            '@cms/system-config/feature-housing-coordination-management'
          ).then(
            (m) => m.SystemConfigFeatureHousingCoordinationManagementModule
          ),
    
      },
      {
        path: 'lov',
        loadChildren: () =>
          import('@cms/system-config/feature-lov').then(
            (m) => m.SystemConfigFeatureLovModule
          ),
     
      },
      {
        path: 'other-lists',
        loadChildren: () =>
          import('@cms/system-config-feature-other-lists').then(
            (m) => m.SystemConfigFeatureOtherListsModule
          ),
    
      },
      {
        path: 'service-provider',
        loadChildren: () =>
          import('@cms/system-config/feature-service-provider').then(
            (m) => m.SystemConfigFeatureServiceProviderModule
          ),
      
      },
      {
        path: 'template-management',
        loadChildren: () =>
          import('@cms/system-config/feature-template-management').then(
            (m) => m.SystemConfigFeatureTemplateManagementModule
          ),
       
      },
      {
        path: 'user-management',
        loadChildren: () =>
          import('@cms/system-config/feature-user-management').then(
            (m) => m.SystemConfigFeatureUserManagementModule
          ),
      
      }, 
      {
        path: '',
        redirectTo: 'user-management',
        pathMatch: 'full',
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class SystemConfigFeatureHomeRoutingModule {}
