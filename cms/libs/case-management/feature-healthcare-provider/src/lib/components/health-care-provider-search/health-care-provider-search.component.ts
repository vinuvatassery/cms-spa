/** Angular **/
import {
    Component,   
    ChangeDetectionStrategy,  
    Input,
    Output,
    EventEmitter

  } from '@angular/core';
import { HealthcareProviderFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';


 @Component({
    selector: 'case-management-health-care-provider-search',
    templateUrl: './health-care-provider-search.component.html',
    styleUrls: ['./health-care-provider-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })

export class HealthCareProviderSearchComponent
{

     /** Output properties  **/
  @Output() closeProviderSearchEvent = new EventEmitter();
  /** Constructor **/
  constructor(private readonly drugPharmacyFacade: HealthcareProviderFacade) {}

  public formUiStyle : UIFormStyle = new UIFormStyle();

    /** Input properties **/
  @Input() isEditSearchHealthProviderValue!: boolean;

  /** Public properties **/
  providers$ = this.drugPharmacyFacade.healthCareProviders$;
  isOpenNewProviderClicked = false;
  filteredSelectedProvider! : any;
  isAdminRole =false;

  /** Internal event methods **/
  onCloseNewPharmacyClicked() {
    this.closeProviderSearchEvent.emit();
    this.isOpenNewProviderClicked = false;
  }

  onOpenNewProviderClicked() {
    this.isOpenNewProviderClicked = true;
  }

  onCloseProviderClicked() {
    this.closeProviderSearchEvent.emit();
  }
}