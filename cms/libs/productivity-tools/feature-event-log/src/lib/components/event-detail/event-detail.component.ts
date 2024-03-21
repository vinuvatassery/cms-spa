/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output, Input } from '@angular/core';
/** Facades **/
import { EventLogFacade } from '@cms/productivity-tools/domain';

import { UIFormStyle } from '@cms/shared/ui-tpa'

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ConfigurationProvider } from '@cms/shared/util-core';


@Component({
  selector: 'productivity-tools-event-detail',
  templateUrl: './event-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailComponent implements OnInit {

  @Output() public closeEventDetailsClickedEmitter = new EventEmitter<any>();
  @Input() eventsdata$: any;
  @Input() entityType: any;
  @Input() entityId: any;
  @Input() clientCaseEligibilityId: any;
  @Input() parentEventLogId: any;
  @Input() eventList : any
  @Input() isSubEvent : any;
  @Input() eventAttachmentTypeList : any
  eventForm!: FormGroup;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  attachmentNoteMaxLength = 100;
  eventDescriptionMaxLength = 7500;
  attachmentNoteCounter!: string;
  attachmentNote = '';
  attachmentNoteCharachtersCount!: number;
  eventDescriptionCounter!: string;
  eventDescription = '';
  eventDescriptionCharachtersCount!: number;
  attachmentFile: any;
  atatchmentValidator: boolean = false;
  attachmentValidatorSize: boolean = false;
  /** Public properties **/
  ddlEvents$ = this.eventLogFacade.ddlEvents$;
  addEventdata$ = this.eventLogFacade.addEventdata$;

  /** Constructor **/
  constructor(private readonly eventLogFacade: EventLogFacade, private readonly formBuilder: FormBuilder,
    private readonly configurationProvider: ConfigurationProvider,

    ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlEvents();
    this.eventDescriptionWordCount();
    this.attachmentNoteWordCount()
    this.buildForm();
    this.addEventdata$.subscribe((response: any) => {
      if (response !== undefined && response !== null) {
       this.closeEventDetails(true);

      }
    });
  }

  /** Private methods **/

  private buildForm() {

    this.eventForm = this.formBuilder.group({
      eventId: [''],
      eventDesc: [''],
      attachmentType: [''],
      attachmentNote: ['']
    });

  }

  private eventDescriptionWordCount() {
    this.eventDescriptionCharachtersCount = this.eventDescription
      ? this.eventDescription.length
      : 0;
    this.eventDescriptionCounter = `${this.eventDescriptionCharachtersCount}/${this.eventDescriptionMaxLength}`;
  }

  private attachmentNoteWordCount() {
    this.attachmentNoteCharachtersCount = this.attachmentNote
      ? this.attachmentNote.length
      : 0;
    this.attachmentNoteCounter = `${this.attachmentNoteCharachtersCount}/${this.attachmentNoteMaxLength}`;
  }

  private loadDdlEvents() {
    this.eventLogFacade.loadDdlEvents();
  }
  closeEventDetails(isLoadEvent : boolean){
    this.closeEventDetailsClickedEmitter.emit(isLoadEvent);
  }

  onEventDescriptionValueChange(event: any): void {
    this.eventDescriptionCharachtersCount = event.length;
    this.eventDescriptionCounter = `${this.eventDescriptionCharachtersCount}/${this.eventDescriptionMaxLength}`;
  }

  onAttachmentNoteValueChange(event: any): void {
    this.attachmentNoteCharachtersCount = event.length;
    this.attachmentNoteCounter = `${this.attachmentNoteCharachtersCount}/${this.attachmentNoteMaxLength}`;
  }

  addEventData()
  {
    this.setValidators();
    if(this.eventForm.valid && !this.attachmentValidatorSize && !this.atatchmentValidator)
    {
      let eventRequestData = {
        clientId: this.entityType === 'CLIENT' ? this.entityId : null,
        clientCaseEligibilityId: this.entityType === 'CLIENT' ? this.clientCaseEligibilityId : null,
        eventId: this.eventForm.controls['eventId'].value,
        eventLogDesc : this.eventForm.controls['eventDesc'].value,
        attachmentTypeCode : this.eventForm.controls['attachmentType'].value,
        attachment : this.attachmentFile,
        attachmentNote :  this.eventForm.controls['attachmentNote'].value,
        sourceEntityId : this.entityId ? this.entityId.toString() : null,
        sourceEntityTypeCode: this.entityType,
        entityTypeCode: this.entityType,
        parentEventLogId : this.parentEventLogId ? this.parentEventLogId : null,
        isSubEvent : this.isSubEvent
      };
      this.eventLogFacade.addEventData(eventRequestData);
    }
  }

  setValidators()
  {
    this.eventForm.markAllAsTouched();
    this.eventForm.controls['eventId'].setValidators([Validators.required,]);
    this.eventForm.controls['eventDesc'].setValidators([Validators.required,]);
    this.eventForm.controls['eventId'].updateValueAndValidity();
    this.eventForm.controls['eventDesc'].updateValueAndValidity();
    if(this.eventForm.controls['attachmentType'].value && !this.attachmentFile)
    {
      this.atatchmentValidator = true;
    }
    else
    {
      this.atatchmentValidator = false;
    }
  }

  handleFileSelected(event: any) {
    this.attachmentFile = null;
    this.attachmentValidatorSize=false;
    this.attachmentFile = event.files[0].rawFile;
    this.atatchmentValidator = false;
   if(this.attachmentFile.size>this.configurationProvider.appSettings.uploadFileSizeLimit)
   {
    this.attachmentValidatorSize=true;
   }
  }

  handleFileRemoved(event: any) {
    this.attachmentValidatorSize=false;
    this.attachmentFile = null;
  }
}
