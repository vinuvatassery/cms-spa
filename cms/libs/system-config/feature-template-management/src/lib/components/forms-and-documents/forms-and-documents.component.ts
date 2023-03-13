/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TemplateManagementFacade } from '@cms/system-config/domain';
import { StringDecoder } from 'string_decoder';

@Component({
  selector: 'system-config-forms-and-documents',
  templateUrl: './forms-and-documents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsAndDocumentsComponent {
  /** Public properties **/
  isOpenAttachment = false;
  foldersList: any = [];

  public constructor(
    private readonly templateManagementFacade: TemplateManagementFacade
  ) {
  }

  ngOnInit() {
    this.templateManagementFacade.getTemplates();
    this.templateManagementFacade.templatesList$.subscribe((templates) => {
      if (!!templates) {
        this.foldersList = templates;
      }
    })
  }
  /** Internal event methods **/
  onCloseAttachmentClicked() {
    this.isOpenAttachment = false;
  }
  onOpenAttachmentClicked() {
    this.isOpenAttachment = true;
  }

  onViewTemplateClick(viewType: string, documentTemplateId: string, name: string) {
    this.templateManagementFacade.viewOrDownloadTemplate(viewType, documentTemplateId, name);
  }

  onDownloadTemplateClick(viewType: string, documentTemplateId: string, name: string) {
    this.templateManagementFacade.viewOrDownloadTemplate(viewType, documentTemplateId, name);
  }

  // foldersList = [
  //   [
  //     {
  //       "documentTemplateId": "daf23c0c-a85d-455d-9703-803daf7d307e",
  //       "name": null,
  //       "folderName": "PROOF_INCOME_TYPE_CODE",
  //       "documentTemplateTypeCode": null,
  //       "templatePath": "www.templatepath.domain.com",
  //       "sequenceNbr": 1,
  //       "templateVersion": 0,
  //       "creatorId": null,
  //       "creationTime": "0001-01-01T00:00:00",
  //       "lastModifierId": null,
  //       "lastModificationTime": null,
  //       "isDeleted": false,
  //       "deleterId": null,
  //       "deletionTime": null,
  //       "extraProperties": "Volo.Abp.Data.ExtraPropertyDictionary",
  //       "concurrencyStamp": "67706e3d19ec44269be724d1465a2c66",
  //       "activeFlag": null
  //     }
  //   ],
  //   [
  //     {
  //       "documentTemplateId": "2f4eb4b1-9a81-407a-af80-9bc0c4fa722b",
  //       "name": null,
  //       "folderName": "COPY OF MEDICARE CARD",
  //       "documentTemplateTypeCode": null,
  //       "templatePath": "www.templatepath.domain.com",
  //       "sequenceNbr": 1,
  //       "templateVersion": 0,
  //       "creatorId": null,
  //       "creationTime": "0001-01-01T00:00:00",
  //       "lastModifierId": null,
  //       "lastModificationTime": null,
  //       "isDeleted": false,
  //       "deleterId": null,
  //       "deletionTime": null,
  //       "extraProperties": "Volo.Abp.Data.ExtraPropertyDictionary",
  //       "concurrencyStamp": "e78e267a9c0e43279dc8cc97a4f3b68b",
  //       "activeFlag": null
  //     }
  //   ],
  //   [
  //     {
  //       "documentTemplateId": "fa9bb442-50b0-4382-8fed-a080f557fed7",
  //       "name": null,
  //       "folderName": "HOME_ADDRESS_PROOF",
  //       "documentTemplateTypeCode": null,
  //       "templatePath": "www.templatepath.domain.com",
  //       "sequenceNbr": 1,
  //       "templateVersion": 0,
  //       "creatorId": null,
  //       "creationTime": "0001-01-01T00:00:00",
  //       "lastModifierId": null,
  //       "lastModificationTime": null,
  //       "isDeleted": false,
  //       "deleterId": null,
  //       "deletionTime": null,
  //       "extraProperties": "Volo.Abp.Data.ExtraPropertyDictionary",
  //       "concurrencyStamp": "ab639d7c95a74f308f59481905ca0f70",
  //       "activeFlag": null
  //     }
  //   ],
  //   [
  //     {
  //       "documentTemplateId": "b554cb9e-a664-431d-a28a-fe10b2d47d8e",
  //       "name": null,
  //       "folderName": "COPY OF SUMMARY OF BENEFITS AND COVERAGE FOLDER",
  //       "documentTemplateTypeCode": null,
  //       "templatePath": "www.templatepath.domain.com",
  //       "sequenceNbr": 39,
  //       "templateVersion": 0,
  //       "creatorId": null,
  //       "creationTime": "0001-01-01T00:00:00",
  //       "lastModifierId": null,
  //       "lastModificationTime": null,
  //       "isDeleted": false,
  //       "deleterId": null,
  //       "deletionTime": null,
  //       "extraProperties": "Volo.Abp.Data.ExtraPropertyDictionary",
  //       "concurrencyStamp": "ec9dbcb254cd4bdcbd5b24ba4ae1f791",
  //       "activeFlag": null
  //     }
  //   ],
  //   [
  //     {
  //       "documentTemplateId": "8df43f6a-9d97-40a8-b88a-836d954c15c0",
  //       "name": null,
  //       "folderName": "COPY OF INSURANCECARD FOLDER",
  //       "documentTemplateTypeCode": null,
  //       "templatePath": "www.templatepath.domain.com",
  //       "sequenceNbr": 39,
  //       "templateVersion": 0,
  //       "creatorId": null,
  //       "creationTime": "0001-01-01T00:00:00",
  //       "lastModifierId": null,
  //       "lastModificationTime": null,
  //       "isDeleted": false,
  //       "deleterId": null,
  //       "deletionTime": null,
  //       "extraProperties": "Volo.Abp.Data.ExtraPropertyDictionary",
  //       "concurrencyStamp": "3fe8078837884b90b557a02b63e42f9f",
  //       "activeFlag": null
  //     },
  //     {
  //       "documentTemplateId": "8d64564a-f832-42c4-87c5-007615caa359",
  //       "name": null,
  //       "folderName": "COPY OF INSURANCECARD FOLDER",
  //       "documentTemplateTypeCode": null,
  //       "templatePath": "www.templatepath.domain.com",
  //       "sequenceNbr": 39,
  //       "templateVersion": 0,
  //       "creatorId": null,
  //       "creationTime": "0001-01-01T00:00:00",
  //       "lastModifierId": null,
  //       "lastModificationTime": null,
  //       "isDeleted": false,
  //       "deleterId": null,
  //       "deletionTime": null,
  //       "extraProperties": "Volo.Abp.Data.ExtraPropertyDictionary",
  //       "concurrencyStamp": "6ae1c02bcb094ac78cfa6356424e8c4d",
  //       "activeFlag": null
  //     }
  //   ],
  //   [
  //     {
  //       "documentTemplateId": "f838c116-e8bf-4ca2-a53a-6383ee512058",
  //       "name": null,
  //       "folderName": "DEPENDENT_PROOF_OF_SCHOOL_CODE",
  //       "documentTemplateTypeCode": null,
  //       "templatePath": "www.templatepath.domain.com",
  //       "sequenceNbr": 112,
  //       "templateVersion": 0,
  //       "creatorId": null,
  //       "creationTime": "0001-01-01T00:00:00",
  //       "lastModifierId": null,
  //       "lastModificationTime": null,
  //       "isDeleted": false,
  //       "deleterId": null,
  //       "deletionTime": null,
  //       "extraProperties": "Volo.Abp.Data.ExtraPropertyDictionary",
  //       "concurrencyStamp": "0058aa31512f4de8b0917411fe543477",
  //       "activeFlag": null
  //     }
  //   ]
  // ]

}
