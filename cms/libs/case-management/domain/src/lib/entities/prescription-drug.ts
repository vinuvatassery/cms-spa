export interface PrescriptionDrug {
   clientCaseEligibilityId: string;
   clientId: string;
   clientCaseId: string;
   prescriptionDrugsForHivCode: string;
   nonPreferredPharmacyCode: string;
   noSummaryOfBenefitsFlag: string;
   concurrencyStamp: string;
   document: PrescriptionDrugDocument;
}

export interface PrescriptionDrugDocument {
   documentId?: string;
   documentName?: string;
   documentPath?: string;
   documentSize?: string;
   concurrencyStamp?: string;
}
