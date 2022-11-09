export interface Workflow {
  workflowStepId: string
  sequenceNbr: number
  title: string
  url: string
  dataPointsTotalCount:number
  sessionData:string
  datapointsAdjustment: DatapointsAdjustment[]
  workFlowProgress: WorkFlowProgress
}

export interface DatapointsAdjustment {
  dataPointAdjustmentId: string
  parentId: string
  processId: string
  datapointName: string
  adjustmentTypeCode?: string
  adjustmentValue: number
  adjustmentOperator: string
}

export interface WorkFlowProgress {
  workflowProgressId?: string
  requiredDatapointsCount?: number
  completedDatapointsCount?: number
  currentFlag?: string
  visitedFlag?: string
}

export interface UpdateWorkFlowProgress {
  navType: string
  workflowProgressId?: string
  datapointsDerivedTotalCount?: number
  datapointsCompletedCount?: number
}

export interface CompletionChecklist {
  dataPointName?: string,
  status?: string,
  //count?: number
}

export interface AjustedDataPointsCheckList {
  parentId: string,
  parentName?: string,
  children?: string[],
  adjustmentOperator: string
}