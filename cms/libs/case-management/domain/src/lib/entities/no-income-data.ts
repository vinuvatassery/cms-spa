export class NoIncomeData {
  clientCaseEligibilityId :string | null = null;
  clientId = 0;
  //noIncomeFlag ='';
  clientDependentsMinorEmployedFlag='';
  clientDependentsMinorAdditionalIncomeFlag='';
  noIncomeSignatureNotedDate:Date|null= new Date;
  noIncomeClientSignedDate:Date|null= new Date;
  noIncomeNote:string|null = '';
  isCERRequest:boolean = false;
}
