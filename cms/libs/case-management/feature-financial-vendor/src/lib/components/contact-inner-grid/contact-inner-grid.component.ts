import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  ChangeDetectorRef
} from '@angular/core';
import { PaymentsFacade, contactResponse } from '@cms/case-management/domain';
import { State } from '@progress/kendo-data-query';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-contact-inner-grid',
  templateUrl: './contact-inner-grid.component.html',
  styleUrls: ['./contact-inner-grid.component.scss'],
   encapsulation: ViewEncapsulation.None,
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactInnerGridComponent {
  contactResponse: contactResponse[] = [];

  constructor(private readonly paymentsFacade: PaymentsFacade,private cd:ChangeDetectorRef) {}

  ngOnInit(): void {
    this.contactResponse=[];
    this.paymentsFacade.contacts$.subscribe((res: any) => {
      this.contactResponse = res;
      this.cd.detectChanges();

    });
  }
}
