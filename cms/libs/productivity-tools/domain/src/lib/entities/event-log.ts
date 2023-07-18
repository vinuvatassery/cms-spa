export class EventLog {
    eventLogId: string|null=null;
    createdBy: string|null=null;
    eventDesc: string|null=null;
    createdTime:Date | null=null;
    eventLogParentId:string|null=null;
    subLogs:EventLog[]|null=null;
  }
  