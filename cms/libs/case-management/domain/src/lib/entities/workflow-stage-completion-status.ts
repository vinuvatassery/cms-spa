//import { AjustedDataPointsCheckList } from "./workflow"

// export interface WorkflowStageCompletionStatus {
//     workflowStepId:string
//     //name:string
//     url:string
//     dataPointsCompleted:number
//     dataPointsTotal:number
//     completionChecklist:CompletionChecklist[]
//     adjustDataPointChecklist: AjustedDataPointsCheckList[]
// }

export interface CompletionChecklist {
    dataPointName?: string,
    status?: string,
  }

export interface WorkflowProcessCompletionStatus {
    processId: string
    completedCount:number,
    calculatedTotalCount:number,
    completionChecklist:CompletionChecklist[]
}
