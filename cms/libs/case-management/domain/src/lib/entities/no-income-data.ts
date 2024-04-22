export class NoIncomeData {
  clientCaseEligibilityId :string | null = null;
  clientId = 0;
  clientDependentsMinorEmployedFlag='';
  clientDependentsMinorAdditionalIncomeFlag='';
  noIncomeSignatureNotedDate:Date|null= new Date;
  noIncomeClientSignedDate:Date|null= new Date;
  noIncomeNote:string|null = '';
  isCERRequest:boolean = false;
  employersIncome !: EmployerIncome[];
}

export class EmployerIncome {
  ClientIncomeId: string | null = null;
  ClientId = 0;
  IncomeSourceCode = '';
  IncomeSourceCodeDesc = '';
  EmployerId: string | null = null;
  EmployerName = '';
  IncomeTypeCodeDesc = '';
  EmployerIncomeYesNo = '';
  IncomeTypeCodeYesNo = '';
  incomeEndDate: string | null = null
}
