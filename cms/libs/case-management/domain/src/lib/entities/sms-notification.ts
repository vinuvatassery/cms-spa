export interface SmsNotification {
    templateId: string;
    entity: string;
    entityId: string;
    recepients: string[] | null;
    Messages: string[];
    clientCaseEligibilityId: string;
    typeCode: string;
    templateTypeCode:string;
}