/**Angualr **/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';


/** Providers **/
import { ConfigurationProvider } from '@cms/shared/util-core';

/**Models */
import { UpdateWorkFlowProgress, Workflow, WorkFlowProgress } from '../entities/workflow';
import { ScreenFlowType } from '../enums/screen-flow-type.enum';


@Injectable({
  providedIn: 'root',
})
export class ScreenRouteDataService {
  constructor(private readonly http: HttpClient, private configurationProvider: ConfigurationProvider) { }

  loadWorkflow(screen_flow_type_code: string, program_id: number, case_id?: number) {
    if (screen_flow_type_code === ScreenFlowType.NewCase) {
      return of([
        {
          workflowStepId: "d7a45d1c-f56e-4307-977a-2133432d0a69",
          sequenceNbr: 1,
          processName: "ApplicantInfo",
          url: "/case-management/case-detail/client",
          title: "Applicant Info",
          workflowStepTypeCode: "1",
          workFlowTypeCode: null,
          processMetadata: "{\"datapointsTotalCount\":\"31\"}",
          processDatapointsAdjustment: [
            {
              dataPointAdjustmentId: "893e753f-1451-48e4-97f0-a5a7c5bac39d",
              processId: "300b2104-6812-459f-a58b-bf481b41af5b",
              dataPointName: "chkmiddleName",
              children:"middleName",
              adjustment: 1,
              adjustmentOperator: "+"
            },
            {
              dataPointAdjustmentId: "22d83a17-10f3-4cc8-86b0-c4b042b09dbf",
              processId: "300b2104-6812-459f-a58b-bf481b41af5b",
              dataPointName: "prmInsNotApplicable",
              children:"prmInsFirstName,prmInsLastName",
              adjustment: 2,
              adjustmentOperator: "-"
            },
            {
              dataPointAdjustmentId: "22d83a17-10f3-4cd8-86b0-c4b042b09dbf",
              processId: "300b2104-6812-459f-a58b-bf481b41af5b",
              dataPointName: "officialIdsNotApplicable",
              children:"officialIdFirstName,officialIdLastName",
              adjustment: 2,
              adjustmentOperator: "-"
            },
            {
              dataPointAdjustmentId: "22d83a17-10f3-4cd8-86b0-c4b042b09dbf",
              processId: "300b2104-6812-459f-a58b-bf481b41af5b",
              dataPointName: "ssnNotApplicable",
              children:"ssn",
              adjustment: 2,
              adjustmentOperator: "-"
            }
          ],
          workFlowProgress: [],                   
          completionChecklist: [
            {
              dataPointName: "firstName",
              status: "N",
              count: 1
            },
            {
              dataPointName: "lastName",
              status: "N",
              count: 1
            },
            {
              dataPointName: "prmInsFirstName",
              status: "N",
              count: 1
            },
            {
              dataPointName: "prmInsLastName",
              status: "N",
              count: 1
            },
            {
              dataPointName: "officialIdFirstName",
              status: "N",
              count: 1
            },
            {
              dataPointName: "officialIdLastName",
              status: "N",
              count: 1
            },
            {
              dataPointName: "dateOfBirth",
              status: "N",
              count: 1
            },
            {
              dataPointName: "ssn",
              status: "N",
              count: 1
            }          

          ]
        },
        {
          workflowStepId: "f5380143-bdad-4c6b-9a0e-2fddae8c5cf6",
          sequenceNbr: 2,
          processName: "ContactInfo",
          url: "/case-management/case-detail/contact-info",
          title: "Contact Info",
          workflowStepTypeCode: "1",
          workFlowTypeCode: null,
          processMetadata: "{\"datapointsTotalCount\":\"31\"}",
          processDatapointsAdjustment: [],
          workFlowProgress: [],
          completionChecklist: []
        },
        {
          workflowStepId: "66b80d31-c803-4d2d-b7c8-3aea3bbe9c34",
          sequenceNbr: 3,
          processName: "FamilyDependents",
          url: "/case-management/case-detail/family-dependents",
          title: "Family & Dependents",
          workflowStepTypeCode: "1",
          workFlowTypeCode: null,
          processMetadata: "{\"datapointsTotalCount\":\"31\"}",
          processDatapointsAdjustment: [],
          workFlowProgress: [],
          completionChecklist: []
        },
        {
          workflowStepId: "8649edde-adb9-4e8c-96ff-3f6ff5dda100",
          sequenceNbr: 4,
          processName: "Income",
          url: "/case-management/case-detail/income",
          title: "Income",
          workflowStepTypeCode: "1",
          workFlowTypeCode: null,
          processMetadata: "{\"datapointsTotalCount\":\"31\"}",
          processDatapointsAdjustment: [],
          workFlowProgress: [],
          completionChecklist: []
        },
        {
          workflowStepId: "b3e00eaf-4507-41d3-9949-4d6aee353f38",
          sequenceNbr: 5,
          processName: "Employment",
          url: "/case-management/case-detail/employment",
          title: "Employment",
          workflowStepTypeCode: "1",
          workFlowTypeCode: null,
          processMetadata: "{\"datapointsTotalCount\":\"31\"}",
          processDatapointsAdjustment: [],
          workFlowProgress: [],
          completionChecklist: []
        },
        {
          workflowStepId: "cef9c1e3-e84a-4157-b824-626ec6e0babe",
          sequenceNbr: 6,
          processName: "SmokingCessation",
          url: "/case-management/case-detail/smoking-cessation",
          title: "Smoking Cessation",
          workflowStepTypeCode: "1",
          workFlowTypeCode: null,
          processMetadata: "{\"datapointsTotalCount\":\"31\"}",
          processDatapointsAdjustment: [],
          workFlowProgress: [],
          completionChecklist: [
            {
              dataPointName: "mokingCessation",
              status: "N",
              count: 1
            },
            {
              dataPointName: "mokingCessationNote",
              status: "N",
              count: 1
            }
          ]
        },
        {
          workflowStepId: "63735a5c-f690-4449-b592-8114b1b71878",
          sequenceNbr: 7,
          processName: "HealthInsurance",
          url: "/case-management/case-detail/health-insurance",
          title: "Health Insurance",
          workflowStepTypeCode: "1",
          workFlowTypeCode: null,
          processMetadata: "{\"datapointsTotalCount\":\"31\"}",
          processDatapointsAdjustment: [],
          workFlowProgress: [],
          completionChecklist: []
        },
        {
          workflowStepId: "a47bd72a-de4b-4548-959b-8449744d2252",
          sequenceNbr: 8,
          processName: "Prescriptiondrugs",
          url: "/case-management/case-detail/prescription-drugs",
          title: "Prescription Drugs",
          workflowStepTypeCode: "1",
          workFlowTypeCode: null,
          processMetadata: "{\"datapointsTotalCount\":\"31\"}",
          processDatapointsAdjustment: [],
          workFlowProgress: [],
          completionChecklist: []
        },
        {
          workflowStepId: "1ac5e970-24a6-4c73-b637-86836095e8af",
          sequenceNbr: 9,
          processName: "HIVHealthcareProvider",
          url: "/case-management/case-detail/healthcare-provider",
          title: "HIV Healthcare Provider",
          workflowStepTypeCode: "1",
          workFlowTypeCode: null,
          processMetadata: "{\"datapointsTotalCount\":\"0\"}",
          processDatapointsAdjustment: [],
          workFlowProgress: [],
          completionChecklist: []
        },
        {
          workflowStepId: "861dc307-9d21-4f92-8e66-94783038d5f2",
          sequenceNbr: 10,
          processName: "HIVCaseManager",
          url: "/case-management/case-detail/case-manager",
          title: "HIV Case Manager",
          workflowStepTypeCode: "1",
          workFlowTypeCode: null,
          processMetadata: "{\"datapointsTotalCount\":\"31\"}",
          processDatapointsAdjustment: [],
          workFlowProgress: [],
          completionChecklist: []
        },
        {
          workflowStepId: "c09257c0-85c1-453f-887a-e9d381923945",
          sequenceNbr: 11,
          processName: "HIVVerification",
          url: "/case-management/case-detail/verification",
          title: "HIV Verification",
          workflowStepTypeCode: "1",
          workFlowTypeCode: null,
          processMetadata: "{\"datapointsTotalCount\":\"31\"}",
          processDatapointsAdjustment: [],
          workFlowProgress: [],
          completionChecklist: []
        },
        {
          workflowStepId: "0286b7b1-cc75-47f7-8af9-fb315ff75732",
          sequenceNbr: 12,
          processName: "Authorization",
          url: "/case-management/case-detail/authorization",
          title: "Authorization",
          workflowStepTypeCode: "1",
          workFlowTypeCode: null,
          processMetadata: "{\"datapointsTotalCount\":\"31\"}",
          processDatapointsAdjustment: [],
          workFlowProgress: [],
          completionChecklist: []
        }
      ]);
      // return this.http.get<Workflow[]>(
      //   `${this.configurationProvider.appSettings.caseApiUrl}/workflows/${program_id}`
      // );
    }
    else {
      return this.http.get<Workflow[]>(
        `${this.configurationProvider.appSettings.caseApiUrl}/workflows/progress/${case_id}`
      );
    }
  }

  saveWorkflowProgress(updateWorkFlowProgress: UpdateWorkFlowProgress) {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/workflows/navigate?workFlowNavType=next`,
      updateWorkFlowProgress
    );
  }

  saveManualWorkflowChange(currentWorkflow: any) {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}/workflows/mark_as_current`,
      currentWorkflow
    );
  }

  load(screen_flow_type_code: string, program_id: number, case_id?: number) {
    if (case_id) {
      if (program_id == 1) {
        return of([
          {
            name: 'Applicant Info',
            url: '/case-management/case-detail/client',
            sequence_nbr: 99,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Contact Info',
            url: '/case-management/case-detail/contact-info',
            sequence_nbr: 100,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'Y',
            visited_flag: 'Y',
          },
          {
            name: 'Family & Dependents',
            url: '/case-management/case-detail/family-dependents',
            sequence_nbr: 101,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Income',
            url: '/case-management/case-detail/income',
            sequence_nbr: 102,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Employment',
            url: '/case-management/case-detail/employment',
            sequence_nbr: 103,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Cessation',
            url: '/case-management/case-detail/smoking-cessation',
            sequence_nbr: 104,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Health Insurance',
            url: '/case-management/case-detail/health-insurance',
            sequence_nbr: 105,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Prescription Drugs',
            url: '/case-management/case-detail/prescription-drugs',
            sequence_nbr: 106,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'HIV Healthcare Provider',
            url: '/case-management/case-detail/healthcare-provider',
            sequence_nbr: 107,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'HIV Case Manager',
            url: '/case-management/case-detail/case-manager',
            sequence_nbr: 108,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'HIV Verification',
            url: '/case-management/case-detail/case-manager',
            sequence_nbr: 109,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Authorization',
            url: '/case-management/case-detail/authorization',
            sequence_nbr: 110,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
        ]);
      } else {
        return of([
          {
            name: 'Applicant Info',
            url: '/case-management/case-detail/client',
            sequence_nbr: 99,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Contact Info',
            url: '/case-management/case-detail/contact-info',
            sequence_nbr: 100,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'Y',
            visited_flag: 'Y',
          },
          {
            name: 'Family & Dependents',
            url: '/case-management/case-detail/family-dependents',
            sequence_nbr: 101,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Income',
            url: '/case-management/case-detail/income',
            sequence_nbr: 102,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Employment',
            url: '/case-management/case-detail/employment',
            sequence_nbr: 103,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Cessation',
            url: '/case-management/case-detail/smoking-cessation',
            sequence_nbr: 104,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Health Insurance',
            url: '/case-management/case-detail/health-insurance',
            sequence_nbr: 105,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Prescription Drugs',
            url: '/case-management/case-detail/prescription-drugs',
            sequence_nbr: 106,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Authorization',
            url: '/case-management/case-detail/authorization',
            sequence_nbr: 110,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
        ]);
      }
    } else {
      if (program_id == 1) {
        return of([
          {
            name: 'Applicant Info',
            url: '/case-management/case-detail/client',
            sequence_nbr: 99,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Contact Info',
            url: '/case-management/case-detail/contact-info',
            sequence_nbr: 100,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'Y',
            visited_flag: 'Y',
          },
          {
            name: 'Family & Dependents',
            url: '/case-management/case-detail/family-dependents',
            sequence_nbr: 101,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Income',
            url: '/case-management/case-detail/income',
            sequence_nbr: 102,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Employment',
            url: '/case-management/case-detail/employment',
            sequence_nbr: 103,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Cessation',
            url: '/case-management/case-detail/smoking-cessation',
            sequence_nbr: 104,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Health Insurance',
            url: '/case-management/case-detail/health-insurance',
            sequence_nbr: 105,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Prescription Drugs',
            url: '/case-management/case-detail/prescription-drugs',
            sequence_nbr: 106,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'HIV Healthcare Provider',
            url: '/case-management/case-detail/healthcare-provider',
            sequence_nbr: 107,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'HIV Case Manager',
            url: '/case-management/case-detail/case-manager',
            sequence_nbr: 108,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'HIV Verification',
            url: '/case-management/case-detail/verification',
            sequence_nbr: 109,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Authorization',
            url: '/case-management/case-detail/authorization',
            sequence_nbr: 110,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
        ]);
      } else {
        return of([
          {
            name: 'Applicant Info',
            url: '/case-management/case-detail/client',
            sequence_nbr: 99,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Contact Info',
            url: '/case-management/case-detail/contact-info',
            sequence_nbr: 100,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'Y',
            visited_flag: 'Y',
          },
          {
            name: 'Family & Dependents',
            url: '/case-management/case-detail/family-dependents',
            sequence_nbr: 101,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Income',
            url: '/case-management/case-detail/income',
            sequence_nbr: 102,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Employment',
            url: '/case-management/case-detail/employment',
            sequence_nbr: 103,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Cessation',
            url: '/case-management/case-detail/smoking-cessation',
            sequence_nbr: 104,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Health Insurance',
            url: '/case-management/case-detail/health-insurance',
            sequence_nbr: 105,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Prescription Drugs',
            url: '/case-management/case-detail/prescription-drugs',
            sequence_nbr: 106,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Authorization',
            url: '/case-management/case-detail/authorization',
            sequence_nbr: 110,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
        ]);
      }
    }
  }
}
