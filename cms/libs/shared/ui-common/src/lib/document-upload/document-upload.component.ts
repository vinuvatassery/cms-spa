import { Component, ChangeDetectorRef, Output, EventEmitter, Input, OnInit, } from '@angular/core';
import { Lov, LovFacade } from '@cms/system-config/domain';
import {  ConfigurationProvider ,DocumentFacade} from '@cms/shared/util-core';
import { FileRestrictions, SelectEvent } from '@progress/kendo-angular-upload';
import { UIFormStyle } from '@cms/shared/ui-tpa'

@Component({
  selector: 'common-document-upload',
  templateUrl: './document-upload.component.html',
})
export class DocumentUploadComponent  implements OnInit{

  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Input() isDisabled!: any
  @Input() typeCode!: any
  @Input() file!: any
  @Input() fieldName!: any
  @Input() multipleFilesUpload!: any
  @Input() typeCodeLabel!: string;
  @Input() subTypeCodeLabel!: string;
  @Input() currentTypeCode!: string;
  @Input() formSubmitted!: boolean;
  @Input() isFileViewable!: boolean;  
  @Input() isDownloadShow!: boolean;  
  subTypeCodes: Lov[] = [];
  selectedTypeCode! : any;
  selectedsubTypeCode = "";
  @Output() handleFileSelectEvent= new EventEmitter<any>();
  @Output() handleFileRemoveEvent= new EventEmitter<any>();
  @Output() handleTypeCodeEvent= new EventEmitter<any>();
  documentTypeCodeSubject$= this.lov.documentTypeCodeSubject$;
  fileUploadRestrictions: FileRestrictions = {
    maxFileSize: this.configurationProvider.appSettings.uploadFileSizeLimit,
  };


   /** Constructor **/
   constructor(
    private lov: LovFacade,
    private readonly configurationProvider: ConfigurationProvider,
    public readonly documentFacade: DocumentFacade,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.selectedTypeCode = this.currentTypeCode;
  }

    /** Lifecycle hooks **/
  ngOnInit(): void {
    if(this.currentTypeCode)
    {
      this.selectedTypeCode = this.currentTypeCode;
    }
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
    if(this.currentTypeCode)
    {
      this.selectedTypeCode = this.currentTypeCode;
    }
    if(this.typeCode || this.selectedTypeCode)
    {
      this.lov.getDocumentSubTypeLovs(this.typeCode ?? this.selectedTypeCode).subscribe((Lov: Lov[]) => {
        this.subTypeCodes = Lov;
        this.cdr.detectChanges();
      });
    }
    this.handleTypeCodeEvent.emit(this.typeCode??this.selectedTypeCode);
  }
  handleFileSelected(e: SelectEvent) {
    this.handleFileSelectEvent.emit(e);
    this.handleTypeCodeEvent.emit(this.typeCode??this.selectedTypeCode);
  }
  handleFileRemoved(e: SelectEvent) {
    this.handleFileRemoveEvent.emit(e);
  }

}
