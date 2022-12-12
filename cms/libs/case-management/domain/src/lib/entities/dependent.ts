export interface Dependent {
    clientDependentId  :  string  ,
    clientId  : number,
    dependentTypeCode  :  string  ,
    relationshipCode  :    string  ,
    relationshipDescription    : string
    firstName  :    string  ,
    lastName  :   string  ,
    fullName  :   string  ,
    ssn  :    string  ,
    dob  :   Date  ,
    age : string ,
    phoneNbr  :    string  ,
    effectiveDate  :    string  ,
    hivPositiveFlag  :   string  ,
    enrolledInInsuranceFlag  :   string  ,
    justMemo  :    string  ,
    finMemo  :   string  ,
    proContactFlag  :    string  ,    
    concurrencyStamp  :  string  ,
    activeFlag  :    string    ,
    isCareAssistFlag : string  ,
    memberType : string,
    fullCustomName :string,
    dependentClientId : string
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

	        

