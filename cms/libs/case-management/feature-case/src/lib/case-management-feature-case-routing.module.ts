import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CasePageComponent } from './containers/case-page/case-page.component';
import { Case360PageComponent } from './containers/case360-page/case360-page.component';
import { CaseSummaryComponent } from './containers/case-summary/case-summary.component';

const routes: Routes = [
  {
    path: '',
    component: CasePageComponent,
    data: {
      title: null
    }, 
    children:[
      {
        outlet: 'todoReminderList',
        path: '',
        loadChildren: () =>
          import('@cms/productivity-tools/feature-todo').then(
            (m) => m.ProductivityToolsFeatureTodoModule
          )   
      }
    ]
  },  
  {
    path: 'case360/:id',
    component: Case360PageComponent,
    data: {
      title: 'Client Profile',
    }, 
    children:[
      {
        path: 'client',
        loadChildren: () =>
          import('@cms/case-management/feature-client').then(
            (m) => m.CaseManagementFeatureClientModule
          ),
        data: {
          title: '',
        },
      },
      {
        path: 'contact-info',
        loadChildren: () =>
          import('@cms/case-management/feature-contact').then(
            (m) => m.CaseManagementFeatureContactModule
          ),
        data: {
          title: '',
        },
      },
      {
        path: 'family-dependents',
        loadChildren: () =>
          import('@cms/case-management/feature-family-and-dependent').then(
            (m) => m.CaseManagementFeatureFamilyAndDependentModule
          ),
        data: {
          title: '',
        },
      },
      {
        path: 'health-insurance',
        loadChildren: () =>
          import('@cms/case-management/feature-health-insurance').then(
            (m) => m.CaseManagementFeatureHealthInsuranceModule
          ),
        data: {
          title: '',
        },
      },
      {
        path: 'prescription-drugs',
        loadChildren: () =>
          import('@cms/case-management/feature-drug').then(
            (m) => m.CaseManagementFeatureDrugModule
          ),
        data: {
          title: '',
        },
      },
      {
        path: 'healthcare-provider',
        loadChildren: () =>
          import('@cms/case-management/feature-healthcare-provider').then(
            (m) => m.CaseManagementFeatureHealthcareProviderModule
          ),
        data: {
          title: '',
        },
      },
      {
        path: 'case-manager',
        loadChildren: () =>
          import('@cms/case-management/feature-management').then(
            (m) => m.CaseManagementFeatureManagementModule
          ),
        data: {
          title: '',
        },
      },
      {
        path: 'case-document',
        loadChildren: () =>
          import('@cms/case-management/feature-document').then(
            (m) => m.CaseManagementFeatureDocumentModule
          ),
        data: {
          title: '',
        },
      },
      {
        path: 'income',
        loadChildren: () =>
          import('@cms/case-management/feature-income').then(
            (m) => m.CaseManagementFeatureIncomeModule
          ),
        data: {
          title: '',
        },
      },
      {
        path: 'case-status-period',
        loadChildren: () =>
          import('@cms/case-management/feature-cer-tracking').then(
            (m) => m.CaseManagementFeatureCerTrackingModule
          ),
        data: {
          title: '',
        },
      },
      {
        outlet: 'commonActions',
        path: '',
        loadChildren: () =>
          import('@cms/productivity-tools/feature-fabs-menu').then(
            (m) => m.ProductivityToolsFeatureFabsMenuModule
          )   
      },
    ]
  },
  {
    path: 'case-summary',
    component: CaseSummaryComponent,
    data: {
      title: null,
    }, 
  }
 
  
];

@NgModule({
  imports: [CommonModule,
    RouterModule.forChild(routes),
  ],  
  exports: [RouterModule],
})

export class CaseManagementFeatureCaseRoutingModule {}
