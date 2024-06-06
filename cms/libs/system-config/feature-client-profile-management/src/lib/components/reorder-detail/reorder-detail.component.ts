import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'system-config-reorder-detail',
  templateUrl: './reorder-detail.component.html',
  styleUrls: ['./reorder-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReorderDetailComponent implements OnInit {

 /** Public properties **/
 @Input() lovType: any;
 @Input() fromScreen: any;
 @Output() reorderCancelEvent = new EventEmitter<any>();
 public formUiStyle : UIFormStyle = new UIFormStyle();
 orderTypeCode: string = 'FOLDER_SORT';
 folderSort!: any;
 reorderList$ = this.lovFacade.reorderList$;
 reorderList: any = [];
  /** Constructor **/
  constructor(private readonly lovFacade: LovFacade,
    private readonly ref: ChangeDetectorRef,
    private loggingService: LoggingService,
    private readonly loaderService: LoaderService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
) { }

 ngOnInit(): void {
  this.loadSortDropdown();
  this.loadOrderListByType();
}

loadOrderListByType() {
    this.showLoader();
    this.lovFacade.getReorderLovs(this.lovType)
        .subscribe({
          next: (data: any) => {
            if (data) {
              this.reorderList = data;
              this.ref.detectChanges();
              this.loaderService.hide();
            }
          },
          error: (err: any) => {
            this.loaderService.hide();
            this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          },
        });
  }

  loadSortDropdown() {
  this.showLoader();
  this.lovFacade.loadReorderSortDropdown(this.orderTypeCode)
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.folderSort = data.map((item: any) => ({
              lovCode: item.lovCode,
              lovDesc: item.lovDesc
            }));
            this.ref.detectChanges();
            this.loaderService.hide();
          }
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

  onCancelClicked(){
    this.reorderCancelEvent.emit(true);
  }
 
  onUpdateClicked(){
   
  }
 
  onSortOptionChange(event: any){
 
  }

  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
  if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
  }
  this.notificationSnackbarService.manageSnackBar(type, subtitle)
  this.hideLoader();
}
}
