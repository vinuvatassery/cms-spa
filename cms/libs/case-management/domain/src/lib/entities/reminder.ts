export class Reminder {
  linkedItemId: number = 0;
  alertId:string | null = "";
  alertDueTime: Date | null = new Date;
  alertDueDate:string = "";
  alertDesc: string = "";
  addToOutlookFlag:string|null = "";
}
