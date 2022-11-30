export interface Client {
   clientId : number,
   clientFullName :  string ,
   dob :  Date ,
   ssn :  string 
}

export interface SpecialHandling {
  id: number;
  specialHandling: string;
  answer: string;
}
