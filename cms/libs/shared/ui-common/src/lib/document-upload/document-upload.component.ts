import { Component, ChangeDetectorRef, Output, EventEmitter, Input, OnInit, } from '@angular/core';
import { Lov, LovFacade } from '@cms/system-config/domain';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType,ConfigurationProvider } from '@cms/shared/util-core';
import { IncomeFacade, StatusFlag, IncomeTypeCode,ClientDocumentFacade } from '@cms/case-management/domain';
import { FileRestrictions, SelectEvent } from '@progress/kendo-angular-upload';
import { UIFormStyle } from '@cms/shared/ui-tpa'



@Component({
  selector: 'common-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss'],
})
export class DocumentUploadComponent  implements OnInit{

  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Input() isDisabled!: any
  @Input() typeCode!: any
  @Input() file!: any
  subTypeCodes: Lov[] = [];
  selectedTypeCode! : any;
  selectedsubTypeCode = "";
  @Output() handleFileSelectEvent= new EventEmitter<any>();
  @Output() handleFileRemoveEvent= new EventEmitter<any>();
  documentTypeCodeSubject$= this.lov.documentTypeCodeSubject$;
  fileUploadRestrictions: FileRestrictions = {
    maxFileSize: this.configurationProvider.appSettings.uploadFileSizeLimit,
  };
   /** Constructor **/
   constructor(
    private lov: LovFacade,
    private readonly loaderService: LoaderService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly configurationProvider: ConfigurationProvider,
    public readonly clientDocumentFacade: ClientDocumentFacade,
    private readonly cdr: ChangeDetectorRef
  ) { }

    /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadTypeCodeLov();
    this.loadSubTypeCodeLov();
  }

  private loadTypeCodeLov() {
    if(!this.typeCode)
    {
      this.lov.getDocumentTypeLovs();
    }
  }
  public loadSubTypeCodeLov() {
    if(this.typeCode || this.selectedTypeCode)
    {
      this.lov.getDocumentSubTypeLovs(this.typeCode ?? this.selectedTypeCode).subscribe((Lov: Lov[]) => {
        this.subTypeCodes = Lov;
        this.cdr.detectChanges();
      });
    }
  }
  handleFileSelected(e: SelectEvent) {
    this.handleFileSelectEvent.emit(e);
  }
  handleFileRemoved(e: SelectEvent) {
    this.handleFileRemoveEvent.emit(e);
  }

}
