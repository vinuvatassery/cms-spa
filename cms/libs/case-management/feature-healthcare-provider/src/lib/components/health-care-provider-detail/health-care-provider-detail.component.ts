/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
/** Facades **/
import { HealthcareProviderFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-health-care-provider-detail',
  templateUrl: './health-care-provider-detail.component.html',
  styleUrls: ['./health-care-provider-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthCareProviderDetailComponent implements OnInit {
  /** Input properties **/
  @Input() isEditHealthProviderValue!: boolean;

  /** Public properties **/
  ddlStates$ = this.providerFacade.ddlStates$;

  /** Constructor **/
  constructor(private readonly providerFacade: HealthcareProviderFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    console.log('')
  }

  
}
