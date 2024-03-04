import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router'; 
const routes: Routes = [
      {
        path: 'cases',
        loadChildren: () =>
          import('@cms/system-config/feature-cases').then(
            (m) => m.SystemConfigFeatureCasesModule
          ),
          data: {
            title: '',
          },
      },
      {
        path: 'client-profile',
        loadChildren: () =>
          import('@cms/system-config/feature-client-profile-management').then(
            (m) => m.SystemConfigFeatureClientProfileManagementModule
          ),
          data: {
            title: '',
          },
      },
      {
        path: 'communication',
        loadChildren: () =>
          import('@cms/system-config/feature-communication').then(
            (m) => m.SystemConfigFeatureCommunicationModule
          ),
          data: {
            title: '',
          },
      },
      {
        path: 'financials',
        loadChildren: () =>
          import('@cms/system-config/feature-financials').then(
            (m) => m.SystemConfigFeatureFinancialsModule
          ),
          data: {
            title: '',
          },
      },
      {
        path: 'housing-coordination',
        loadChildren: () =>
          import(
            '@cms/system-config/feature-housing-coordination-management'
          ).then(
            (m) => m.SystemConfigFeatureHousingCoordinationManagementModule
          ),
          data: {
            title: '',
          },
      },
      {
        path: 'lov',
        loadChildren: () =>
          import('@cms/system-config/feature-lov').then(
            (m) => m.SystemConfigFeatureLovModule
          ),
          data: {
            title: '',
          },
      },
      {
        path: 'other-lists',
        loadChildren: () =>
          import('@cms/system-config-feature-other-lists').then(
            (m) => m.SystemConfigFeatureOtherListsModule
          ),
          data: {
            title: '',
          },
      },
      {
        path: 'service-provider',
        loadChildren: () =>
          import('@cms/system-config/feature-service-provider').then(
            (m) => m.SystemConfigFeatureServiceProviderModule
          ),
          data: {
            title: '',
          },
      },
      {
        path: 'template-management',
        loadChildren: () =>
          import('@cms/system-config/feature-template-management').then(
            (m) => m.SystemConfigFeatureTemplateManagementModule
          ),
          data: {
            title: '',
          },
      },
      {
        path: 'user-management',
        loadChildren: () =>
          import('@cms/system-config/feature-user-management').then(
            (m) => m.SystemConfigFeatureUserManagementModule
          ),
          data: {
            title: '',
          },
      },
     
    ]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemConfigFeatureHomeRoutingModule {}
