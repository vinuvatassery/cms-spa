export class Client {
  clientId :number =0;
  firstName :string|null=null;
  middleName :string|null=null;
  noMiddleInitialFlag :string='';
  lastName :string='';
  clientFullName :string='';
  dob:Date= new Date;
  ssn :string|null=null;
  ssnNotApplicableFlag :string='';
  genderAtBirthCode :string='';
  genderAtBirthDesc :string='';
  urn :string='';
  encryptedUrn :string='';
  medicareEligibleDate :Date=new Date;
  genderType :string='';  
  creatorId :string | null =null;
  creationTime? :Date | null = null;
  lastModifierId :string| null =null;
  lastModificationTime? :Date | null=null;
  isDeleted :boolean=false ;
  deleterId :string | null =null;
  deletionTime? :Date | null =null;
  extraProperties :string | null =null;
  concurrencyStamp :string | null =null;
  activeFlag :string='';
}

export interface SpecialHandling {
  id: number;
  specialHandling: string;
  answer: string;
}
