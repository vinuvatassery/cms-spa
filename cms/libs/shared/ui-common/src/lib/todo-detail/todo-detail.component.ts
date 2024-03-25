/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/** facades **/
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { Observable, Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'productivity-tools-todo-detail',
  templateUrl: './todo-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoDetailComponent implements OnInit {
  tareaCustomTodoMaxLength = 100;
  tareaCustomTodoCharactersCount!: number;
  tareaCustomTodoCounter!: string;
  tareaCustomTodoDescription = '';
   @Input() isEdit= false;
   @Input() alertId='62E3DDBA-2B16-49F3-9DA2-06EDA4CA76FF'
  @Input() getTodo$! : Observable<any>
  @Input() createTodo$! : Observable<any>
  @Input() providerSearchResult$ :any
  @Input() clientSearchResult$! : Observable<any>
  @Input() frequencyTypeCodeSubject$! :  Observable<any>;
  @Input() entityTypeCodeSubject$!: Observable<any>;
  @Input() medicalProviderSearchLoaderVisibility$! : Observable<any>
  @Input() clientSearchLoaderVisibility$! : Observable<any>
  showTimePicker =false
  showClientSearch = false;
  showVendorSearch = true;
  
  @Output() isModalTodoDetailsCloseClicked = new EventEmitter();
  @Output() isLoadTodoGridEvent = new EventEmitter();
  @Output() searchClientName = new EventEmitter();
  @Output() searchProvider = new EventEmitter();
  @Output() onTodoItemCreateClick = new EventEmitter();
  @Output() onUpdateTodoItemClick = new EventEmitter();
  @Output() onGetTodoItem = new EventEmitter();
  @Output() getTodoItemsLov = new EventEmitter();
  @Input() searchProviderSubject! : Subject<any>
  @Input() clientSubject! : Subject<any>
  @Output() onDeleteAlertClicked = new EventEmitter()
  showClientSearchInputLoader = false
  placeholderText =""
  vendorPlaceHolderText = "Search for Vendor Name or TIN";
  clientPlaceHolderText = "Search for Client Name, ID or SSN";
  filterManager: Subject<string> = new Subject<string>();
  public date = new Date();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  todoDetailsForm:any
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  isValidateForm= false;

  constructor(public formBuilder: FormBuilder,
    public intl: IntlService,
    private configurationProvider: ConfigurationProvider,
    private cdr : ChangeDetectorRef){
      this.todoDetailsForm = this.formBuilder.group({})
  }
  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.getTodoItemsLov.emit()
    this.todoDetailsForm = this.formBuilder.group({
      title: ['', Validators.required],
      dueDate: [null,Validators.required],
      repeat: [''],
      endDate: [null],
      alertDesc: [''],
      linkTo: ['',Validators.required],
      clientId :[null],
      vendorId: [null]
    });
    if(this.isEdit){
      this.onGetTodoItem.emit(this.alertId);
    }
    this.tareaVaribalesIntialization();
    this.buildTodoForm()
  }

  buildTodoForm(){
    if(!this.isEdit){
    this.todoDetailsForm.controls['clientId'].disable()
    this.todoDetailsForm.controls['vendorId'].disable()
    this.todoDetailsForm.controls['repeat'].setValue('NEVER')
    this.todoDetailsForm.controls['repeat'].disable()
    this.todoDetailsForm.controls['endDate'].disable()
  }else{
    this.getTodo$.subscribe(res =>{
      if (this.isEdit && res) {
        this.todoDetailsForm.patchValue({
          title: res.alertName,
          repeat: res.alertFrequencyCode,
          alertDesc: res.alertDesc,
          linkTo: res.entityTypeCode
        })
        this.todoDetailsForm.controls["dueDate"].setValue(new Date(res.alertDueDate));
        if(res.alertEndDate){
        this.todoDetailsForm.controls["endDate"].setValue(new Date(res.alertEndDate));
        }
        else{
        this.todoDetailsForm.controls["endDate"].setValue(null);

        }
       if(res.entityTypeCode !=='CLIENT'){
        this.showVendorSearch = true;
        this.showClientSearch = false;
        this.placeholderText = this.vendorPlaceHolderText;
        this.searchProviderSubject.next([
          { providerName : res.providerName,
            tin : res.tin,
            providerId: res.entityId
          }
        ])
        this.todoDetailsForm.controls["vendorId"].setValue({
          providerName : res.providerName,
          tin : res.tin,
          providerId: res.entityId
        })
        this.todoDetailsForm.controls['vendorId'].setValidators([Validators.required]);
        this.todoDetailsForm.controls['vendorId'].updateValueAndValidity();
      }else{
        this.showVendorSearch = false;
        this.showClientSearch = true;
        this.placeholderText = this.clientPlaceHolderText;

        this.clientSubject.next([{
          clientFullName : res.clientFullName,
          dob : res.dob,
          ssn: res.ssn,
          clientId : res.entityId
        }])
        this.todoDetailsForm.controls["clientId"].setValue({
          clientFullName : res.clientFullName,
          dob : res.dob,
          ssn: res.ssn,
          clientId : res.entityId
        })
        this.todoDetailsForm.controls['clientId'].setValidators([Validators.required]);
        this.todoDetailsForm.controls['clientId'].updateValueAndValidity();
      }   
    }
    });
  }
  }

  loadVendorsBySearchText(vendorSearchText:any){
    if (!vendorSearchText || vendorSearchText.length == 0) {
      return
    }
    this.searchProvider.emit({SearchText : vendorSearchText, 
      VendorTypeCode : this.todoDetailsForm.controls['linkTo'].value})
  }


    
  loadClientBySearchText(clientSearchText: any) {
    if (!clientSearchText || clientSearchText.length == 0) {
      return
    }
    this.showClientSearchInputLoader = true;
    clientSearchText = clientSearchText.replace("/", "-");
    clientSearchText = clientSearchText.replace("/", "-");
    this.clientSearchResult$.subscribe(res =>{
      this.showClientSearchInputLoader = false;
    })
    this.searchClientName.emit(clientSearchText)
  }

  onLinkToChange(event:any){
    if(event == 'CLIENT'){
      this.todoDetailsForm.controls['clientId'].enable()
  this.showClientSearch = true;
  this.showVendorSearch = false;
  this.placeholderText= this.clientPlaceHolderText
  this.todoDetailsForm.controls['vendorId'].clearValidators();
  this.todoDetailsForm.controls['vendorId'].updateValueAndValidity();
  this.todoDetailsForm.controls['clientId'].setValidators([Validators.required]);
  this.todoDetailsForm.controls['clientId'].updateValueAndValidity(); 
    }else{
    this.todoDetailsForm.controls['vendorId'].enable()
      this.showClientSearch = false;
      this.showVendorSearch = true;
     this.placeholderText= this.vendorPlaceHolderText
     this.todoDetailsForm.controls['clientId'].clearValidators();
     this.todoDetailsForm.controls['clientId'].updateValueAndValidity();
     this.todoDetailsForm.controls['vendorId'].setValidators([Validators.required]);
     this.todoDetailsForm.controls['vendorId'].updateValueAndValidity();
    }
  }

  
  onDueChange(event:any){
    this.todoDetailsForm.controls['repeat'].enable();
    this.todoDetailsForm.controls['endDate'].enable();
    this.todoDetailsForm.controls['repeat'].setValidators(Validators.required)
  }
  /** Private methods **/
  private tareaVaribalesIntialization() {
    this.tareaCustomTodoCharactersCount = this.tareaCustomTodoDescription
      ? this.tareaCustomTodoDescription.length
      : 0;
    this.tareaCustomTodoCounter = `${this.tareaCustomTodoCharactersCount}/${this.tareaCustomTodoMaxLength}`;
  }
  private loadToDoSearch() {
    this.isLoadTodoGridEvent.emit();
  }

  /** Internal event methods **/
  onTareaCustomTodoValueChange(event: any): void {
    this.tareaCustomTodoCharactersCount = event.length;
    this.tareaCustomTodoCounter = `${this.tareaCustomTodoCharactersCount}/${this.tareaCustomTodoMaxLength}`;
  }
  closeTodoDetailsClicked(event:any) {
    this.isModalTodoDetailsCloseClicked.emit(event);
  }

  CreateToDoItem(){
    this.createTodo$.subscribe(res =>{
      if(res){
      this.loadToDoSearch()
      this.closeTodoDetailsClicked(true)
      }
    })
    let entityTypeCode ='';
    let entityId =''
    this.todoDetailsForm.markAllAsTouched()
    this.isValidateForm =true;
    if(!this.todoDetailsForm.controls['clientId'].value?.clientId && this.showClientSearch){
      this.todoDetailsForm.controls['clientId'].setErrors({ 'required': true });
    }
    if (this.todoDetailsForm.invalid) {
      return;
    }
   const dueDate = new Date(this.intl.formatDate(this.todoDetailsForm.controls['dueDate'].value, this.dateFormat));
   const endDate = new Date(this.intl.formatDate(this.todoDetailsForm.controls['endDate'].value, this.dateFormat));
if(this.todoDetailsForm.controls['linkTo'].value =='CLIENT'){
  entityTypeCode = 'CLIENT'
  entityId =  this.todoDetailsForm.controls['clientId'].value.clientId?.toString()
}else{
  entityTypeCode = 'VENDOR'
  entityId =  this.todoDetailsForm.controls['vendorId'].value.providerId?.toString()
}
    const payload ={
      alertName :  this.todoDetailsForm.controls['title'].value,
      alertDueDate : dueDate,
      alertEndDate : endDate,  
      alertDesc : this.todoDetailsForm.controls['alertDesc'].value,
      entityTypeCode : entityTypeCode,
      entityId :entityId ,
      alertFrequencyCode :  this.todoDetailsForm.controls['repeat'].value,
      customAlertFlag : 'Y',
      type:'TODO'
    }

    if(!this.isEdit){
      
      this.onTodoItemCreateClick.emit(payload)
    }
    else{
      const editPayload ={
        ...payload,
        alertId :    this.alertId,
      }
    this.onUpdateTodoItemClick.emit(editPayload);
    }
  }

  
  delete(){
    this.createTodo$.subscribe(res =>{
      if(res){
      this.closeTodoDetailsClicked(true)
      }
    })
    this.onDeleteAlertClicked.emit(this.alertId)
   }

  endDateValidation(){
    const endDate = this.todoDetailsForm.controls['endDate'].value;
    const dueDate = this.todoDetailsForm.controls['dueDate'].value;
    if (endDate < dueDate && this.todoDetailsForm.controls['endDate'].value) {
      this.todoDetailsForm.controls['endDate'].setErrors({ 'incorrect': true });
    
      return;
    }
  }

}
