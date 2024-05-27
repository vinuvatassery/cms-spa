import { Client } from "./client";
import { ClientCaseEligibilityAndFlag } from "./client-case-eligibility-and-flag";
import { ClientGender } from "./client-gender";
import { ClientPronoun } from "./client-pronoun";
import { ClientRace } from "./client-race";
import { ClientSexualIdentity } from "./client-sexual-identity";

export class ApplicantInfo{

    workFlowSessionId:string|null=null ;
    client :Client = new Client;
    clientCaseId:string|null=null;
    clientCaseEligibilityAndFlag:ClientCaseEligibilityAndFlag  = new ClientCaseEligibilityAndFlag
    clientPronounList: ClientPronoun[]=[]
    clientSexualIdentityList:ClientSexualIdentity[]=[]
    clientRaceList:ClientRace[]=[]
    clientGenderList:ClientGender[]=[]
    ClientNotes:any[] | [] = [];
    clientCerNotes: any[]=[]
}
