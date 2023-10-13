/** Angular **/
import {    Component,     ChangeDetectionStrategy,      Input,    Output,   EventEmitter, OnInit, ChangeDetectorRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HealthcareProviderFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';

import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

 @Component({
    selector: 'case-management-health-care-provider-search',
    templateUrl: './health-care-provider-search.component.html',
    styleUrls: ['./health-care-provider-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })

export class HealthCareProviderSearchComponent implements OnInit
{

  filterManager: Subject<string> = new Subject<string>();
     /** Output properties  **/
  @Output() closeProviderSearchEvent = new EventEmitter();
  @Output() businessLogicEvent = new EventEmitter();
  @Output() searchTextEvent = new EventEmitter<string>(); 
  @Output() addExistingProviderEvent = new EventEmitter<any>(); 
  @Output() deleteProviderEvent =  new EventEmitter<string>();
  btnDisabled = false;

  public formUiStyle : UIFormStyle = new UIFormStyle();

    /** Input properties **/
  @Input() isEditSearchHealthProviderValue!: boolean;
  @Input() prvId!: string;
  @Input() healthCareProviderSearchList$: any;
  @Input() addExistingProvider$: any;
  @Input() loadExistingProvider$: any;  
  @Input() existingProviderData: any;  
  @Input() searchProviderLoaded$: any;
  @Input() selectedCustomProviderName: any;  
  @Input() hasCreateUpdatePermission:boolean=false; //Healtcare provider Add/Request

  /** Public properties **/
  providers$ = this.drugPharmacyFacade.healthCareProviders$;
  isOpenNewProviderClicked = false;
  filteredSelectedProvider! : any;
  isAdminRole =false;   
  popupClass = 'k-autocomplete-custom';
  selectedClinic! : string
 
  existHealthProvderForm!: FormGroup;
  isExistSubmitted =false;

    /** Constructor **/
    constructor(private readonly drugPharmacyFacade: HealthcareProviderFacade,
      private formBuilder: FormBuilder,
      private readonly ref: ChangeDetectorRef) 
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
  
      /** Lifecycle hooks **/
  ngOnInit(): void {       
    this.composexistHealthProvdeForm();
  }
  composexistHealthProvdeForm()
  {    
      this.existHealthProvderForm = this.formBuilder.group({   
        providerId: ['',Validators.required]   ,
        selectedProviderId: [''] ,
        providerAutoComplete : ['',Validators.required]       
      });
      
     if(this.isEditSearchHealthProviderValue === true)
     {
       this.onExistProviderFormLoad()
     }
     else
     {
      this.existHealthProvderForm.patchValue(
        {
          selectedProviderId: '00000000-0000-0000-0000-000000000000'        
        }) 
     }
     
  }

  onExistProviderFormLoad()
  {     
    
    this.existHealthProvderForm.setValue(
            {
               selectedProviderId: this.existingProviderData?.providerId  ,
              providerId: this.existingProviderData?.providerId  ,
              providerAutoComplete : this.selectedCustomProviderName             
            }) 
  }

  onSearchTemplateClick(dataItem : any)
  {    
    this.existHealthProvderForm.patchValue(
      {
        providerId: dataItem?.providerId  
      })  
  }

    onExistHealthProvderSubmit()
    {      
       this.isExistSubmitted = true;
       if(this.existHealthProvderForm.valid)
       {        
        const existProviderData =
        {
          providerId : this.existHealthProvderForm?.controls["providerId"].value,
          selectedProviderId  : this.existHealthProvderForm?.controls["selectedProviderId"].value         
        }        
        this.btnDisabled = true
        this.addExistingProviderEvent.emit(existProviderData);
       }
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
       if(text.length > 0)
       {      
       
         this.filterManager.next(text); 
       }
  } 

}