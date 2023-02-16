import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'system-config-pca-codes',
  templateUrl: './pca-codes.component.html',
  styleUrls: ['./pca-codes.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PcaCodesComponent {
}
