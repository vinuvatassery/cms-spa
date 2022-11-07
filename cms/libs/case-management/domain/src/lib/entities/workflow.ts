export interface Workflow {
  workflowStepId: string
  sequenceNbr: number
  title: string
  url: string
  workflowStepTypeCode: string
 // workFlowTypeCode: any
 processMetadata: string
 processDatapointsAdjustment: ProcessDatapointsAdjustment[]
 workFlowProgress: WorkFlowProgress
  //completionChecklist: CompletionChecklist[]
}

export interface ProcessDatapointsAdjustment {
  dataPointAdjustmentId: string
  parentId: string
  processId: string
  datapointName: string
  adjustmentTypeCode?:string
  adjustmentValue: number
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
  //count?: number
}

export interface AjustedDataPointsCheckList {
  parentId:string,
  parentName?: string,
  children?: string[],
  adjustmentOperator: string  
}