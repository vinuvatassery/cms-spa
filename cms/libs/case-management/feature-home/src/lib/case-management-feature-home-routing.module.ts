import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseDetailPageComponent, CaseSummaryComponent } from '@cms/case-management/feature-case';

const routes: Routes = [ 
  {
    path: 'cases',
    loadChildren: () =>
      import('@cms/case-management/feature-case').then(
        (m) => m.CaseManagementFeatureCaseModule
      ),
    data: {
      title: '',
    },
  },
  {
    path: 'case-detail',
    component: CaseDetailPageComponent,   
    data: {
      title: '',
    }, 
    children: [
      {
        path: 'case-summary',
        component:CaseSummaryComponent,
          data: {
            title: 'New Application',
          }, 
      },
      {
        path: 'client',
        loadChildren: () =>
          import('@cms/case-management/feature-client').then(
            (m) => m.CaseManagementFeatureClientModule
          ),
        data: {
          title: 'New Application',
        },
      },
      {
        path: 'contact-info',
        loadChildren: () =>
          import('@cms/case-management/feature-contact').then(
            (m) => m.CaseManagementFeatureContactModule
          ),
        data: {
          title: 'New Application',
        },
      },
      {
        path: 'family-dependents',
        loadChildren: () =>
          import('@cms/case-management/feature-family-and-dependent').then(
            (m) => m.CaseManagementFeatureFamilyAndDependentModule
          ),
        data: {
          title: 'New Application',
        },
      },
      {
        path: 'income',
        loadChildren: () =>
          import('@cms/case-management/feature-income').then(
            (m) => m.CaseManagementFeatureIncomeModule
          ),
        data: {
          title: 'New Application',
        },
      },
      {
        path: 'employment',
        loadChildren: () =>
          import('@cms/case-management/feature-employment').then(
            (m) => m.CaseManagementFeatureEmploymentModule
          ),
        data: {
          title: 'New Application',
        },
      },
      {
        path: 'smoking-cessation',
        loadChildren: () =>
          import('@cms/case-management/feature-smoking-cessation').then(
            (m) => m.CaseManagementFeatureSmokingCessationModule
          ),
          data: {
            title: 'New Application',
          },
      },
      {
        path: 'health-insurance',
        loadChildren: () =>
          import('@cms/case-management/feature-health-insurance').then(
            (m) => m.CaseManagementFeatureHealthInsuranceModule
          ),
        data: {
          title: 'New Application',
        },
      },
      {
        path: 'prescription-drugs',
        loadChildren: () =>
          import('@cms/case-management/feature-drug').then(
            (m) => m.CaseManagementFeatureDrugModule
          ),
        data: {
          title: 'New Application',
        },
      },
      {
        path: 'healthcare-provider',
        loadChildren: () =>
          import('@cms/case-management/feature-healthcare-provider').then(
            (m) => m.CaseManagementFeatureHealthcareProviderModule
          ),
        data: {
          title: 'New Application',
        },
      },
      {
        path: 'case-manager',
        loadChildren: () =>
          import('@cms/case-management/feature-management').then(
            (m) => m.CaseManagementFeatureManagementModule
          ),
        data: {
          title: 'New Application',
        },
      },
      {
        path: 'verification',
        loadChildren: () =>
          import('@cms/case-management/feature-verification').then(
            (m) => m.CaseManagementFeatureVerificationModule
          ),
        data: {
          title: 'New Application',
        },
      },
      {
        path: 'authorization',
        loadChildren: () =>
          import('@cms/case-management/feature-authorization').then(
            (m) => m.CaseManagementFeatureAuthorizationModule
          ),
        data: {
          title: 'New Application',
        },
      },
      {
        path: 'application-review',
        loadChildren: () =>
          import('@cms/case-management/feature-client-eligibility').then(
            (m) => m.CaseManagementFeatureClientEligibilityModule
          ),
        data: {
          title: '',
        },
      },
      {
        path: 'send-letter',
        loadChildren: () =>
          import('@cms/case-management/feature-communication').then(
            (m) => m.CaseManagementFeatureCommunicationModule
          ),
        data: {
          title: '',
        },
      },
      // {
      //   path: '',
      //   redirectTo: 'client',
      //   pathMatch: 'full',
      // },
    ],
  },
  {
    path: '',
    redirectTo: 'cases',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [CommonModule,
    RouterModule.forChild(routes),
  ],
})

export class CaseManagementFeatureHomeRoutingModule { }
