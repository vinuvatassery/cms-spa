export class ClientProfile {
     clientId  : number  |0=0;
     firstName  : string  |null=null;
     middleName  : string  |null=null;
     lastName  : string  |null=null;
     caseManagerId: string  |null=null;
     caseManagerName  : string  |null=null;
     caseManagerPNumber  : string |null=null;
     caseManagerDomainCode  : string  |null=null; 
     caseManagerAssisterGroup  : string  |null=null; 
     caseManagerEmail  : string  |null=null;
     caseManagerPhone  : string  |null=null; 
     caseManagerFax  : string  |null=null;
     caseManagerAddress1  : string  |null=null;
     caseManagerAddress2  : string  |null=null; 
     caseManagerCity  : string  |null=null; 
     caseManagerState  : string  |null=null;
     caseManagerZip  : string |null=null;
     insuranceFirstName  : string  |null=null;
     insuranceLastName  : string  |null=null;
     officialIdFirstName  : string  |null=null;
     officialIdLastName  : string  |null=null; 
     dob  : string  |null=null;
     pronouns  : string |null=null;
     genderDescription  : string  |null=null; 
     gender  : string  |null=null;
     sexAtBirth : string  |null=null;
     ssn  : string  |null=null;
     clientTransgenderCode  : string  |null=null;
     clientTransgenderDesc  : string  |null=null;
     clientSexualIdentities  : string  |null=null; 
     otherSexualDesc  : string  |null=null;
     spokenLanguage  : string  |null=null; 
     writtenLanguage  : string  |null=null; 
     englishProficiency  : string  |null=null;
     ethnicIdentity  : string  |null=null;
     racialIdentities  : string []=[];
     primaryRacialIdentity  : string |null=null;
     lastModificationTime : string |null=null;
     lastModifierName : string |null=null;
     lastModifierId : string |null=null;
     userFirstName : string |null=null;
     userLastName : string |null=null;
     isUserProfilePhotoExist : boolean |null=null;
     creatorId : string |null=null;
     caseManagerFirstName : string |null=null;
     caseManagerLastName : string |null=null;
     isCaseManagerProfilePhotoExist : boolean |null=null;
     creationTime : string |null=null;
}