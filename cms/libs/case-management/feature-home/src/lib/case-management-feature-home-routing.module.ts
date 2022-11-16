import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseDetailPageComponent } from '@cms/case-management/feature-case';

const routes: Routes = [ 
  {
    path: 'cases',
    loadChildren: () =>
      import('@cms/case-management/feature-case').then(
        (m) => m.CaseManagementFeatureCaseModule
      ),
    data: {
      title: null,
    },
  },
  {
    path: 'case-detail',
    component: CaseDetailPageComponent,    
    children: [
      {
        path: 'client',
        loadChildren: () =>
          import('@cms/case-management/feature-client').then(
            (m) => m.CaseManagementFeatureClientModule
          ),
        data: {
          title: null,
        },
      },
      {
        path: 'contact-info',
        loadChildren: () =>
          import('@cms/case-management/feature-contact').then(
            (m) => m.CaseManagementFeatureContactModule
          ),
        data: {
          title: null,
        },
      },
      {
        path: 'family-dependents',
        loadChildren: () =>
          import('@cms/case-management/feature-family-and-dependent').then(
            (m) => m.CaseManagementFeatureFamilyAndDependentModule
          ),
        data: {
          title: null,
        },
      },
      {
        path: 'income',
        loadChildren: () =>
          import('@cms/case-management/feature-income').then(
            (m) => m.CaseManagementFeatureIncomeModule
          ),
        data: {
          title: null,
        },
      },
      {
        path: 'employment',
        loadChildren: () =>
          import('@cms/case-management/feature-employment').then(
            (m) => m.CaseManagementFeatureEmploymentModule
          ),
        data: {
          title: null,
        },
      },
      {
        path: 'smoking-cessation',
        loadChildren: () =>
          import('@cms/case-management/feature-smoking-cessation').then(
            (m) => m.CaseManagementFeatureSmokingCessationModule
          ),
      },
      {
        path: 'health-insurance',
        loadChildren: () =>
          import('@cms/case-management/feature-health-insurance').then(
            (m) => m.CaseManagementFeatureHealthInsuranceModule
          ),
        data: {
          title: null,
        },
      },
      {
        path: 'prescription-drugs',
        loadChildren: () =>
          import('@cms/case-management/feature-drug').then(
            (m) => m.CaseManagementFeatureDrugModule
          ),
        data: {
          title: null,
        },
      },
      {
        path: 'healthcare-provider',
        loadChildren: () =>
          import('@cms/case-management/feature-healthcare-provider').then(
            (m) => m.CaseManagementFeatureHealthcareProviderModule
          ),
        data: {
          title: null,
        },
      },
      {
        path: 'case-manager',
        loadChildren: () =>
          import('@cms/case-management/feature-management').then(
            (m) => m.CaseManagementFeatureManagementModule
          ),
        data: {
          title: null,
        },
      },
      {
        path: 'verification',
        loadChildren: () =>
          import('@cms/case-management/feature-verification').then(
            (m) => m.CaseManagementFeatureVerificationModule
          ),
        data: {
          title: null,
        },
      },
      {
        path: 'authorization',
        loadChildren: () =>
          import('@cms/case-management/feature-authorization').then(
            (m) => m.CaseManagementFeatureAuthorizationModule
          ),
        data: {
          title: null,
        },
      },
      {
        path: 'application-eligibility',
        loadChildren: () =>
          import('@cms/case-management/feature-client-eligibility').then(
            (m) => m.CaseManagementFeatureClientEligibilityModule
          ),
        data: {
          title: null,
        },
      },
      {
        path: 'send-letter',
        loadChildren: () =>
          import('@cms/case-management/feature-communication').then(
            (m) => m.CaseManagementFeatureCommunicationModule
          ),
        data: {
          title: null,
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
