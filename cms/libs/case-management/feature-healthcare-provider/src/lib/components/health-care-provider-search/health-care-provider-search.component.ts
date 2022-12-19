/** Angular **/
import {    Component,     ChangeDetectionStrategy,      Input,    Output,   EventEmitter  } from '@angular/core';
import { HealthcareProviderFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

 @Component({
    selector: 'case-management-health-care-provider-search',
    templateUrl: './health-care-provider-search.component.html',
    styleUrls: ['./health-care-provider-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })

export class HealthCareProviderSearchComponent
{

  filterManager: Subject<string> = new Subject<string>();
     /** Output properties  **/
  @Output() closeProviderSearchEvent = new EventEmitter();
  @Output() businessLogicEvent = new EventEmitter();
  @Output() searchTextEvent = new EventEmitter<string>(); 


  public formUiStyle : UIFormStyle = new UIFormStyle();

    /** Input properties **/
  @Input() isEditSearchHealthProviderValue!: boolean;
  @Input() prvId!: string;
  @Input() healthCareProviderSearchList$: any;
  
  @Output() deleteProviderEvent =  new EventEmitter<string>();

  /** Public properties **/
  providers$ = this.drugPharmacyFacade.healthCareProviders$;
  isOpenNewProviderClicked = false;
  filteredSelectedProvider! : any;
  isAdminRole =false; 
  providerSearchInputLoader = false;
  popupClass = 'k-autocomplete-custom';
  selectedClinic! : string

    /** Constructor **/
    constructor(private readonly drugPharmacyFacade: HealthcareProviderFacade) 
    {
      this.filterManager
      .pipe(   
      debounceTime(500),
      distinctUntilChanged()
      )      
      .subscribe(
        (text) => 
        {
          if(text)
          {
          this.searchTextEvent.emit(text)        
          }
        }
        ); 
    }

  onDeleteConfirm()
  {  
    this.deleteProviderEvent.emit(this.prvId);
  }

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
  onOpenBusinessLogicClicked()
  {
    this.businessLogicEvent.emit();
  }

  onsearchTextChange(text : string)
  {     
       if(text.length > 1)
       {
         this.providerSearchInputLoader = true;
         this.filterManager.next(text); 
       }
  } 
  
}