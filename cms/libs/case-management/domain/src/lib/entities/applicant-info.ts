import { ClientCase } from "./clien-case";
import { Client } from "./client";
import { ClientCaseEligibility } from "./client-case-eligibility";
import { ClientGender } from "./client-gender";
import { ClientPronoun } from "./client-pronoun";
import { ClientRace } from "./client-race";
import { ClientSexualIdentity } from "./client-sexual-identity";

export interface ApplicantInfo{
    client :Client
    // clientCase: ClientCase
    // clientCaseEligibility:ClientCaseEligibility
    // clientPronounList: ClientPronoun[]
    // clientSexualIdentityList:ClientSexualIdentity[]
    // clientRaceList:ClientRace[]
    // clientGenderList:ClientGender[]
}
