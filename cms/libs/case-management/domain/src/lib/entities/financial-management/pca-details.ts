export interface PcaDetails {
    pcaCode: number
    appropriationYear: number
    pcaDesc: string
    openDate: string
    closeDate: string
    totalAmount: number
    fundingSourceId: string
  }
  export interface UpdatePcaDetails{
    openDate: string
    closeDate: string
    assignmentAmount: number
    pcaAssignmentId:string
    UnlimitedFlag:string
    pcaId:string  
  }