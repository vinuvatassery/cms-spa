import { CardRequestsComponent } from "./components/card-requests/card-requests.component";
import { ClientRecordSentComponent } from "./components/client-record-sent/client-record-sent.component";
import { OrderDataComponent } from "./components/order-data/order-data.component";
import { PrescriptionfillloadingComponent } from "./components/prescriptionfillloading/prescriptionfillloading.component";

export const WidgetRegistry: { [key: string]: any } = {
  CardRequests: CardRequestsComponent,
  ClientRecordSent: ClientRecordSentComponent,
  OrderData: OrderDataComponent,
  Prescriptionfillloading: PrescriptionfillloadingComponent,
 
};

export const WIDGET_COMPONENT = [
  CardRequestsComponent,
  ClientRecordSentComponent,
  OrderDataComponent,
  PrescriptionfillloadingComponent
];
