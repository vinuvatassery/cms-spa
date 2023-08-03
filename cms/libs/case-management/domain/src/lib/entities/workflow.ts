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
  workFlow : any
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
