/** Angular **/
import {    Component,     ChangeDetectionStrategy,      Input,    Output,   EventEmitter, OnInit, ChangeDetectorRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';

import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

 @Component({
    selector: 'case-management-case-manager-search',
    templateUrl: './case-manager-search.component.html',
    styleUrls: ['./case-manager-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })

export class CaseManagerSearchComponent implements OnInit
{

  filterManager: Subject<string> = new Subject<string>();
     /** Output properties  **/
  @Output() closeCaseManagerSearchEvent = new EventEmitter();
  @Output() searchTextEvent = new EventEmitter<string>(); 
  @Output() addExistingCaseManagerEvent = new EventEmitter<any>(); 
  @Output() deleteCaseManagerEvent =  new EventEmitter<string>();

  public formUiStyle : UIFormStyle = new UIFormStyle();

    /** Input properties **/
  @Input() isEditSearchCaseManagerValue!: boolean;
  @Input() selectedCaseManagerId!: string;
  @Input() caseManagerSearchList$: any;    
  @Input() existingCaseManagerData: any; 
  @Input() selectedCustomCaseManagerName: any;  
 

  /** Public properties **/
  isOpenNewProviderClicked = false;
  filteredSelectedProvider! : any;
  isAdminRole =false; 
  caseSearchInputLoader = false;
  popupClass = 'k-autocomplete-custom';
  selectedClinic! : string
 
  existCaseManagerForm!: FormGroup;
  isExistSubmitted =false;

    /** Constructor **/
    constructor(private formBuilder: FormBuilder,
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
    this.composeExistCaseManagerForm();   
  }
  composeExistCaseManagerForm()
  {    
      this.existCaseManagerForm = this.formBuilder.group({   
        assignedcaseManagerId: ['',Validators.required]          
      });
      
     if(this.isEditSearchCaseManagerValue === true)
     {
       this.onExistCaseManagerFormLoad()
     }   
  }

  onExistCaseManagerFormLoad()
  {     
    
    this.existCaseManagerForm.setValue(
            {
              assignedcaseManagerId: this.existingCaseManagerData?.assignedcaseManagerId               
           }) 
  }

  onSearchTemplateClick(dataItem : any)
  {    
    this.existCaseManagerForm.patchValue(
      {
        assignedcaseManagerId: dataItem?.loginUserId  
      })  
  }

  onCaseManagerSubmit()
    {      
       this.isExistSubmitted = true;
       if(this.existCaseManagerForm.valid)
       {
        const existCaseManagerData =
        {
          assignedcaseManagerId : this.existCaseManagerForm?.controls["assignedcaseManagerId"].value       
        }        
        this.addExistingCaseManagerEvent.emit(existCaseManagerData);
       }
    }


  onDeleteConfirm()
  {  
    this.deleteCaseManagerEvent.emit(this.selectedCaseManagerId);
  }

  /** Internal event methods **/

  onCloseCaseManagerSearchClicked() {
    this.closeCaseManagerSearchEvent.emit();
  }

  onsearchTextChange(text : string)
  {     
       if(text.length > 1)
       {
         this.caseSearchInputLoader = true;
         this.filterManager.next(text); 
       }
  } 

  searchCloseEvent()
  {
    this.caseSearchInputLoader = false;
  }


}