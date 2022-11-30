export interface Dependent {
  fullLegalName:string;
  relationshipToClient:string;
  careAssistClient:string;
  dateOfBirth:string;
  insurancePlan:string;
}
export interface Product {
  name: string;
  id: string;
  dob: string;
  ssn: string;
}


export interface FamilyDependent{
  clientDependetId: number;
  clientId:number;
	dependentTypeCode: string;
	dependentClientId?: number;
  relationshipCode: string;
	firstName: string;
  lastName: string;
	ssn: string;
	dob: Date;
	phoneNbr: string;
  effectiveDate?: Date;
  hivPositiveFlag:string;
  enrolledInInsuranceFlag:string;
  justMemo:string;
  finMemo:string;
  proContactFlag: string;
  createUser :string;
  createDate:Date;
  lastUpdateUser:string;
  lastUpdateDate:Date;
  activeFlag:string;
}

	        

