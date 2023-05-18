export class NewIDCardRequest{
    inboundFlag : string = "N";
    interfaceTypeCode : string = "RMSL";
    processTypeCode : string = "RMSL_EEC";
    eventType : string = "RMSL_ENROLL_REQUESTED";
    clientId : number | null = 0;
    replacementCardIndicator : boolean | null = true;
  }