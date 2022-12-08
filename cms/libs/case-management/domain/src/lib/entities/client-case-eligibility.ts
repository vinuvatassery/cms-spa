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
        clientTransgenderDesc !:string;
        genderDesc !:string;
        materialInAlternateFormatCode !:string;
        spokenLanguageCode :string|null=null;
        writtenLanguageCode :string|null=null;
        englishProficiencyCode :string|null=null;
        interpreterCode :string|null=null;
        interpreterType :string|null=null;
        deafOrHearingCode :string|null=null;
        startAgeDeafOrHearing :number=0;
        blindSeeingCode :string|null=null;
        startAgeBlindSeeing :number=0;
        limitingConditionCode :string |null=null;
        startAgeLimitingCondition :number=0;
        walkingClimbingDifficultyCode :string|null=null;
        startAgeWalkingClimbingDifficulty :number=0;
        dressingBathingDifficultyCode :string|null=null;
        startAgeDressingBathingDifficulty :number=0;
        concentratingDifficultyCode :string|null=null;
        startAgeConcentratingDifficulty :number=0;
        errandsDifficultyCode :string|null=null;
        startAgeErrandsDifficulty :number=0;      
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