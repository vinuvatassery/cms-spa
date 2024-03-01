import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'cms-prescriptionfillloading',
  templateUrl: './prescriptionfillloading.component.html',
  styleUrls: ['./prescriptionfillloading.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrescriptionfillloadingComponent {}
