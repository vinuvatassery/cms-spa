export class AcceptedApplication{
  clientCaseId :string = '';
  clientCaseEligibilityId :string = '';
  caseStatusCode :string = '';
  groupCode :string = '';
  eligibilityStartDate :Date = new Date;
  eligibilityEndDate :Date = new Date;
  eligibilityStatusCode: string=''
  assignedCwUserId :string | null = "";

}
