/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output, Input } from '@angular/core';
/** Facades **/
import { EventLogFacade } from '@cms/productivity-tools/domain';

import { UIFormStyle } from '@cms/shared/ui-tpa'

import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'productivity-tools-event-detail',
  templateUrl: './event-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailComponent implements OnInit {

  @Output() public closeEventDetailsClickedEmitter = new EventEmitter<any>();
  @Input() eventAttachmentTypeLov$: any;
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

  /** Public properties **/
  ddlEvents$ = this.eventLogFacade.ddlEvents$;

  /** Constructor **/
  constructor(private readonly eventLogFacade: EventLogFacade, private readonly formBuilder: FormBuilder
    ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlEvents();
    this.eventDescriptionWordCount();
    this.attachmentNoteWordCount()
    this.buildForm();

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
  closeEventDetails(){
    this.closeEventDetailsClickedEmitter.emit(true);
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
    if(this.eventForm.valid)
    {

    }
  }

  setValidators()
  {
    this.eventForm.markAllAsTouched();
    this.eventForm.controls['eventId'].setValidators([Validators.required,]);
    this.eventForm.controls['eventDesc'].setValidators([Validators.required,]);
    this.eventForm.controls['eventId'].updateValueAndValidity();
    this.eventForm.controls['eventDesc'].updateValueAndValidity();
  }
}
