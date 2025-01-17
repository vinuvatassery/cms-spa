/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
/** facades **/
import { CommunicationFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
@Component({
  selector: 'case-management-template-picker',
  templateUrl: './template-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplatePickerComponent implements OnInit {
  /** Input properties **/
  @Input() data!: any;

  /** Output properties  **/
  @Output() openDdlLetterEvent = new EventEmitter();

  /** Public properties **/
  ddlLetterTemplates$ = this.communicationFacade.ddlLetterTemplates$;
  ddlTemplates: any;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  /** Constructor **/
  constructor(private readonly communicationFacade: CommunicationFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDropdownLetterTemplates();
  }

  /** Private methods **/
  private loadDropdownLetterTemplates() {
    this.communicationFacade.loadDdlLetterTemplates();
    this.ddlLetterTemplates$.subscribe({
      next: (res) => {
        this.ddlTemplates = res.filter((templates: any) => {
          return templates.screenName === this.data;
        });
      },
      error: (err) => {
        console.log('err', err);
      },
    });
  }

  /** External event methods **/
  handleDdlLetterValueChange() {
    this.openDdlLetterEvent.emit();
  }
}
