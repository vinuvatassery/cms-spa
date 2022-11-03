import { CompletionChecklist } from "./workflow"

export interface WorkflowStageCompletionStatus {
    workflowStepId:string
    //name:string
    url:string
    dataPointsCompleted:number
    dataPointsTotal:number
    completionChecklist:CompletionChecklist[]
}