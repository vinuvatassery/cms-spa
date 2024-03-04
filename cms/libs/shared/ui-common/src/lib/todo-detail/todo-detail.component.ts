/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
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
  @Input() clientSearchResult$! : Observable<any>
  @Input() createTodo$! : Observable<any>
  @Input() providerSearchResult$ :any
  EntityTypeCodeData =['CLIENT','MEDICAL_PROVIDER','DENTAL_PROVIDER','INSURANCE_VENDOR']
  @Input() frequencyTypeCodeSubject$ : any;
  showTimePicker =false
  showClientSearch = false;
  showVendorSearch = false;
  @Output() isModalTodoDetailsCloseClicked = new EventEmitter();
  @Output() isLoadTodoGridEvent = new EventEmitter();
  @Output() searchClientName = new EventEmitter();
  @Output() searchProvider = new EventEmitter();
  @Output() onTodoItemCreateClick = new EventEmitter();
  showClientSearchInputLoader = false
  filterManager: Subject<string> = new Subject<string>();
  public date = new Date();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  todoDetailsForm: FormGroup;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  constructor(public formBuilder: FormBuilder,
    public intl: IntlService,
    private configurationProvider: ConfigurationProvider,){
    this.todoDetailsForm = this.formBuilder.group({})
  }
  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadToDoSearch();
    this.tareaVaribalesIntialization();
    this.buildTodoForm()
  }

  buildTodoForm(){
    this.todoDetailsForm = this.formBuilder.group({
      title: ['', Validators.required],
      dueDate: [''],
      repeat: [{value: '', disabled: true}],
      endDate: [{value: '', disabled: true}],
      alertDesc: [''],
      linkTo: [''],
      clientId :[{}],
      vendorId: [{}],
      repeatTime:['']
    });
    this.todoDetailsForm.controls['repeat'].setValue('NEVER')

  }

  loadVendorsBySearchText(vendorSearchText:any){
    if (!vendorSearchText || vendorSearchText.length == 0) {
      return
    }
    this.searchProvider.emit({SearchText : vendorSearchText, 
      VendorTypeCode : this.todoDetailsForm.controls['linkTo'].value})
  }
  onRepeatChange(event:any){
    console.log(event)
    if(event !== 'NEVER'){
      this.showTimePicker =true
    }else{
      this.showTimePicker =false
    }

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
  this.showClientSearch = true;
  this.showVendorSearch = false;
    }else{
      this.showClientSearch = false;
      this.showVendorSearch = true;
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
  closeTodoDetailsClicked() {
    this.isModalTodoDetailsCloseClicked.emit(true);
  }

  CreateToDoItem(){
    this.createTodo$.subscribe(res =>{
      this.closeTodoDetailsClicked()
    })
    let entityTypeCode ='';
    let entityId =''
    this.todoDetailsForm.markAllAsTouched()
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
      repeatTime:new Date(this.todoDetailsForm.controls['repeatTime'].value).getHours()+":"+new Date(this.todoDetailsForm.controls['repeatTime'].value).getMinutes()
    }

    this.onTodoItemCreateClick.emit(payload);
    console.log(payload)
  }
}
