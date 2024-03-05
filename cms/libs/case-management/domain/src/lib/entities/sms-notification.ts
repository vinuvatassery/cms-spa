export interface SmsNotification {
    templateId: string;
    entity: string;
    entityId: string;
    recepients: string[];
    Messages: string[];
    clientCaseEligibilityId: string;
    typeCode: string;
}