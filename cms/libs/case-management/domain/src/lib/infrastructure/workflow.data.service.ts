/**Angualr **/
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

/** Providers **/
import { ConfigurationProvider } from '@cms/shared/util-core';

/**Models */
import { WorkflowMaster, WorkflowSession } from '../entities/workflow';


@Injectable({
  providedIn: 'root',
})
export class WorkflowDataService {
  constructor(private readonly http: HttpClient, private configurationProvider: ConfigurationProvider) { }

  loadWorkflow(session_id?: string) {
      return this.http.get<WorkflowSession>(
        `${this.configurationProvider.appSettings.caseApiUrl}/case-management/workflows/sessions/${session_id}`
      );
  }

  loadWorkflowMaster(entityId:string, entityTypeCode:string, workflowTypeCode: string, ){
    return this.http.get<WorkflowMaster[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/workflows/entityId=${entityId}&workflowTypeCode=${workflowTypeCode}&entityTypeCode=${entityTypeCode}`
    );  
  }

  saveWorkflowProgress(updateWorkFlowProgress: any, sessionId:string) {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/workflows/sessions/${sessionId}/progress`,
      updateWorkFlowProgress
    );
  }

  updateActiveWorkflowStep(workflowProgressId: string, sessionId:string) {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/workflows/sessions/${sessionId}/progress/${workflowProgressId}`,
      {}
    );
  }

  createNewSession(newSessionData: any){
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/workflows/sessions`,
      newSessionData
    );
  }

  load(screen_flow_type_code: string, program_id: number, case_id?: number) {
    if (case_id) {
      if (program_id == 1) {
        return of([
          {
            name: 'Case Details',
            url: '/case-management/case-detail/case-summary',
            sequence_nbr: 99,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Applicant Info',
            url: '/case-management/case-detail/client',
            sequence_nbr: 100,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Contact Info',
            url: '/case-management/case-detail/contact-info',
            sequence_nbr: 101,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'Y',
            visited_flag: 'Y',
          },
          {
            name: 'Family & Dependents',
            url: '/case-management/case-detail/family-dependents',
            sequence_nbr: 102,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Income',
            url: '/case-management/case-detail/income',
            sequence_nbr: 103,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Employment',
            url: '/case-management/case-detail/employment',
            sequence_nbr: 104,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Cessation',
            url: '/case-management/case-detail/smoking-cessation',
            sequence_nbr: 105,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Health Insurance',
            url: '/case-management/case-detail/health-insurance',
            sequence_nbr: 106,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Prescription Drugs',
            url: '/case-management/case-detail/prescription-drugs',
            sequence_nbr: 107,
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
            name: 'Case Details',
            url: '/case-management/case-detail/case-summary',
            sequence_nbr: 99,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Applicant Info',
            url: '/case-management/case-detail/client',
            sequence_nbr: 100,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Contact Info',
            url: '/case-management/case-detail/contact-info',
            sequence_nbr: 101,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'Y',
            visited_flag: 'Y',
          },
          {
            name: 'Family & Dependents',
            url: '/case-management/case-detail/family-dependents',
            sequence_nbr: 102,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Income',
            url: '/case-management/case-detail/income',
            sequence_nbr: 103,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Employment',
            url: '/case-management/case-detail/employment',
            sequence_nbr: 104,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Cessation',
            url: '/case-management/case-detail/smoking-cessation',
            sequence_nbr: 105,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Health Insurance',
            url: '/case-management/case-detail/health-insurance',
            sequence_nbr: 106,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Prescription Drugs',
            url: '/case-management/case-detail/prescription-drugs',
            sequence_nbr: 107,
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
            name: 'Case Details',
            url: '/case-management/case-detail/case-summary',
            sequence_nbr: 99,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Applicant Info',
            url: '/case-management/case-detail/client',
            sequence_nbr: 100,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Contact Info',
            url: '/case-management/case-detail/contact-info',
            sequence_nbr: 101,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'Y',
            visited_flag: 'Y',
          },
          {
            name: 'Family & Dependents',
            url: '/case-management/case-detail/family-dependents',
            sequence_nbr: 102,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Income',
            url: '/case-management/case-detail/income',
            sequence_nbr: 103,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Employment',
            url: '/case-management/case-detail/employment',
            sequence_nbr: 104,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Cessation',
            url: '/case-management/case-detail/smoking-cessation',
            sequence_nbr: 105,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Health Insurance',
            url: '/case-management/case-detail/health-insurance',
            sequence_nbr: 106,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Prescription Drugs',
            url: '/case-management/case-detail/prescription-drugs',
            sequence_nbr: 107,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'HIV Healthcare Provider',
            url: '/case-management/case-detail/healthcare-provider',
            sequence_nbr: 108,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'HIV Case Manager',
            url: '/case-management/case-detail/case-manager',
            sequence_nbr: 109,
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
            sequence_nbr: 111,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
        ]);
      } else {
        return of([
          {
            name: 'Case Details',
            url: '/case-management/case-detail/case-summary',
            sequence_nbr: 99,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Applicant Info',
            url: '/case-management/case-detail/client',
            sequence_nbr: 100,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Contact Info',
            url: '/case-management/case-detail/contact-info',
            sequence_nbr: 101,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'Y',
            visited_flag: 'Y',
          },
          {
            name: 'Family & Dependents',
            url: '/case-management/case-detail/family-dependents',
            sequence_nbr: 102,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Income',
            url: '/case-management/case-detail/income',
            sequence_nbr: 103,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Employment',
            url: '/case-management/case-detail/employment',
            sequence_nbr: 104,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Cessation',
            url: '/case-management/case-detail/smoking-cessation',
            sequence_nbr: 105,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Health Insurance',
            url: '/case-management/case-detail/health-insurance',
            sequence_nbr: 106,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Prescription Drugs',
            url: '/case-management/case-detail/prescription-drugs',
            sequence_nbr: 107,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
          {
            name: 'Authorization',
            url: '/case-management/case-detail/authorization',
            sequence_nbr: 108,
            screen_flow_step_type_code: 'EDIT',
            current_screen_flag: 'N',
            visited_flag: 'Y',
          },
        ]);
      }
    }
  }
}
