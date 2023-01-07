/** Angular **/
import {  Component, OnInit,  ChangeDetectionStrategy,
   ChangeDetectorRef,  Output,  EventEmitter,  Input, ViewChild, AfterViewInit} from '@angular/core';
import { FormBuilder, FormGroup ,Validators} from '@angular/forms';
import { ProgramCode } from '@cms/case-management/domain';
import {   ComboBoxComponent   } from '@progress/kendo-angular-dropdowns';
 
/** Internal Libraries **/
import { UIFormStyle } from '@cms/shared/ui-tpa'

import { debounceTime,  distinctUntilChanged, Subject } from 'rxjs';
import { LoaderService } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
@Component({
  selector: 'case-management-new-case',
  templateUrl: './new-case.component.html',
  styleUrls: ['./new-case.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCaseComponent implements OnInit  {
public showInputLoader = false;
  /*** Output ***/
  @Output() isCreateNewCasePopupOpened = new EventEmitter();
  @Output() newcaseSaveEvent = new EventEmitter<any>();
  @Output() searchTextEvent = new EventEmitter<string>();   

  /** input properties **/
  @Input() caseSearchResults$! : any
  @Input() caseOwners ! : any
  @Input() ddlPrograms! : any
  @Input() ddlCaseOrigins! : any
  @Input() formButtonDisabled! : boolean
  @ViewChild('searchcaseornew')
  private searchcaseornew: any ;

    /** Public properties **/
  parentForm! : FormGroup;
  isProgramSelectionOpened = false;
  selectedProgram!: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  filterManager: Subject<string> = new Subject<string>();
  showSearchresult! : false
 
  isSubmitted! : boolean ;
  /** Constructor**/
  constructor(   
    private readonly ref: ChangeDetectorRef, 
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    public intl: IntlService
  ) {
 
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
        this.showInputLoader = false;  
 
        } 
      }
      
      );    
      this.showInputLoader = false;  
   }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.setDefaultProgram();  
    this.registerFormData(); 
  }
 
  private setDefaultProgram() {   
    this.ddlPrograms.subscribe({
      next: (programs: any) => {
        this.selectedProgram = programs.filter(
          (data: any) => data.programCode == ProgramCode.DefaultProgram
        )[0];
      }
    });  
  }
  private registerFormData()
  {
    
    this.parentForm = this.formBuilder.group({
      applicationDate: [new Date(), Validators.required],
      caseOriginCode: ['', Validators.required],
      caseOwnerId: ['', Validators.required],
      programId: [{ value: this.selectedProgram?.programId, disabled: true }, [Validators.required]] ,
      concurrencyStamp : ['']  
      });
    
  }


  /** Internal event methods **/
  onOpenProgramSelectionClicked() {
    this.loaderService.show()
    this.isProgramSelectionOpened = true;
    this.formButtonDisabled = false;
    this.ref.markForCheck();
  }

  onSubmit() {     
    this.parentForm.markAllAsTouched();
    this.isSubmitted = true;    
    this.newcaseSaveEvent.emit(this.parentForm);

  }

  onCloseProgramSelectionClicked() {
    this.isCreateNewCasePopupOpened.emit();
    this.isProgramSelectionOpened = false;
  }

  onsearchTextChange(text : string)
  {    

    if(text){ 
      this.showInputLoader = true;  
      this.filterManager.next(text); 
    } 
  }

}
