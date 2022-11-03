export interface Workflow {
  workflowStepId: string
  sequenceNbr: number
  processName: string
  url: string
  title: string
  workflowStepTypeCode: string
  workFlowTypeCode: any
  processMetadata: string
  processDatapointsAdjustment: ProcessDatapointsAdjustment[]
  workFlowProgress: WorkFlowProgress
  completionChecklist: CompletionChecklist[]
}

export interface ProcessDatapointsAdjustment {
  dataPointAdjustmentId: string
  processId: string
  dataPointName: string
  children?:string
  adjustment: number
  adjustmentOperator: string
}

export interface WorkFlowProgress {
  workflowProgressId?: string
  datapointsDerivedTotalCount?: number
  datapointsCompletedCount?: number
  currentFlag?: string
  visitedFlag?: string
}

export interface UpdateWorkFlowProgress {
  workflowProgressId?: string
  workflowStepId?: string
  clientCaseEligibilityId?: string
  totalDatapointsCount?: number
  datapointsCompletedCount?: number
  workflowMetadata?: string
}

export interface CompletionChecklist {
  dataPointName?: string,
  status?: string,
  count?: number
}

export interface CompletionStatusUpdate {
  completedFields:string[],
  AdjustmentFields:string[]
}

export interface AdjustAttrChildren {
  fieldNames:string
}