import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { StatusPeriodFacade } from '@cms/case-management/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'case-management-status-fpl-history',
  templateUrl: './status-fpl-history.component.html',
})
export class StatusFplHistoryComponent implements OnInit {

  @Input() eligibilityId!: string;

  statusFplHistory$: any = new Subject<any>();
  loader: boolean = false;
  statusFplProfilePhotoSubject = new Subject();
  constructor(private statusPeriodFacade: StatusPeriodFacade,
    private readonly userManagementFacade: UserManagementFacade,
    private readonly cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.loadFplHistory();
  }

  /* Private methods */
  private loadFplHistory() {
    this.loader = true;
    this.statusPeriodFacade.loadStatusFplHistory(this.eligibilityId).subscribe({
      next: (data) => {
        this.statusFplHistory$.next(data);
        this.loader = false;
        if(data){
          this.loadDistinctUserIdsAndProfilePhoto(data);
        }
      },
      error: (err) => {
        this.loader = false;
        this.statusPeriodFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.statusFplProfilePhotoSubject.next(data);
          }
        },
      });
      this.cdr.detectChanges();
    }
  } 

}
