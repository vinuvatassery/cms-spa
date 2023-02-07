export class ClientCaseEligibility{
        clientCaseEligibilityId :string | null = null;
        clientCaseId !:string;  
        eilgibilityStartDate? :Date;
        eligibilityEndDate? :Date;
        aka :string|null=null;
        insuranceFirstName :string|null=null;
        insuranceLastName :string|null=null;
        officialIdFirstName :string|null=null;
        officialIdLastName :string|null=null;
        groupCode :string|null=null;
        clientTransgenderCode !:string;
        clientTransgenderDesc :string|null=null;
        genderDesc !:string;
        materialInAlternateFormatCode !:string;
        materialInAlternateFormatDesc :string|null=null;
        materialInAlternateFormatOther :string|null=null;
        spokenLanguageCode :string|null=null;
        writtenLanguageCode :string|null=null;
        englishProficiencyCode :string|null=null;
        interpreterCode :string|null=null;
        interpreterType :string|null=null;
        deafOrHearingCode :string|null=null;
        startAgeDeafOrHearing :number|null=null;
        blindSeeingCode :string|null=null;
        startAgeBlindSeeing :number | null = null;
        limitingConditionCode :string |null=null;
        //startAgeLimitingCondition :number|null=null;
        walkingClimbingDifficultyCode :string|null=null;
        startAgeWalkingClimbingDifficulty :number|null=null;
        dressingBathingDifficultyCode :string|null=null;
        startAgeDressingBathingDifficulty :number|null=null;
        concentratingDifficultyCode :string|null=null;
        startAgeConcentratingDifficulty :number|null = null;
        errandsDifficultyCode :string|null=null;
        startAgeErrandsDifficulty :number|null=null;      
        noIncomeClientSignedDate? :Date;
        noIncomeSignatureNotedDate? :Date;
        noIncomeNote :string|null=null;       
        smokingCessationNote :string|null=null;      
        eligibilityStatusCode :string|null=null;
        waitlistStatusCode :string|null=null;
        serviceCoordinationRegionCode :string|null=null;
        serviceCoordinationHcId :number=0;
        serviceCoordinatorServicePointId :number=0;
        fplPercentage :number=0;
        justMemo :string='';
       
}