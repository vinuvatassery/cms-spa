// export interface Workflow {
//   workflowStepId: string
//   sequenceNbr: number
//   title: string
//   url: string
//   dataPointsTotalCount:number
//   sessionData:string
//   datapointsAdjustment: DatapointsAdjustment[]
//   workFlowProgress: WorkFlowProgress
// }

// export interface DatapointsAdjustment1 {
//   dataPointAdjustmentId: string
//   parentId: string
//   processId: string
//   datapointName: string
//   adjustmentTypeCode?: string
//   adjustmentValue: number
//   adjustmentOperator: string
// }

// export interface WorkFlowProgress1 {
//   workflowProgressId?: string
//   requiredDatapointsCount?: number
//   completedDatapointsCount?: number
//   currentFlag?: string
//   visitedFlag?: string
// }

// export interface UpdateWorkFlowProgress {
//   navType: string
//   workflowProgressId?: string
//   datapointsDerivedTotalCount?: number
//   datapointsCompletedCount?: number
// }



// export interface AjustedDataPointsCheckList {
//   parentId: string,
//   parentName?: string,
//   children?: string[],
//   adjustmentOperator: string
// }

//---------------------------new changes--------------------------------------------------//

export interface WorkFlowProgress {
  workflowProgressId: string;
  workflowStepId: string;
  processId: string;
  sequenceNbr: number;
  title: string;
  url: string;
  requiredDatapointsCount: number;
  completedDatapointsCount: number;
  currentFlag: string;
  visitedFlag: string;
}

export interface WorkflowSession {
  workflowSessionId: string;
  sessionData: string;
  workflowId: string;
  workFlowProgress: WorkFlowProgress[];
}

export interface DatapointsAdjustment {
  dataPointAdjustmentId: string;
  parentId: string;
  processId: string;
  datapointName: string;
  adjustmentTypeCode: string;
  adjustmentValue: number;
  adjustmentOperator: string;
}

export interface WorkflowMaster {
  processId: string;
  workflowStepId: string;
  requiredCount: number;
  datapointsAdjustment: DatapointsAdjustment[];
}
