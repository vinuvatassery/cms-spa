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
    workFlowProgress: WorkFlowProgress[]
  }
  
  export interface ProcessDatapointsAdjustment {
    dataPointAdjustmentId: string
    processId: string
    dataPointName: string
    adjustment: number
    adjustmentOperator: string
  }
  
  export interface WorkFlowProgress {
    workflowProgressId?: string
    workflowMetadata?: string
    clientCaseEligibilityId?: string
    datapointsTotalCount?: number
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
  