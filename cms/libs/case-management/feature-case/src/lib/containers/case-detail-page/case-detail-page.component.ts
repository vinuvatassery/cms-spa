/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/** External libraries **/
import { DateInputSize, DateInputRounded, DateInputFillMode, } from '@progress/kendo-angular-dateinputs';
import { forkJoin, mergeMap, of, Subscription } from 'rxjs';

/** Internal Libraries **/
import { CommunicationEvents, ScreenType, NavigationType, CaseFacade, WorkflowFacade, WorkflowTypeCode, StatusFlag } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { LoaderService } from '@cms/shared/util-core';





@Component({
  selector: 'case-management-case-detail-page',
  templateUrl: './case-detail-page.component.html',
  styleUrls: ['./case-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseDetailPageComponent implements OnInit {

  /**Private properties**/
  private navigationSubscription !: Subscription;
  public size: DateInputSize = 'medium';
  public rounded: DateInputRounded = 'full';
  public fillMode: DateInputFillMode = 'outline';

  public formUiStyle: UIFormStyle = new UIFormStyle();
  workflowNavigationEvent = new EventEmitter<string>();
  openedSaveLater = false;
  openedDeleteConfirm = false;
  openedDiscardConfirm = false;
  openedSendNewLetter = false;
  openedPreviewLetter = false;
  openedSaveForLater = false;
  openedSendLetterToPrint = false;
  ddlCommonActions$ = this.caseFacade.ddlCommonActions$;
  ScreenName = ScreenType.CaseDetailPage;
  popupClass = 'app-c-split-button';
  isShowSaveLaterPopup = false;
  isShowDeleteConfirmPopup = false;
  isShowDiscardConfirmPopup = false;
  isShowSendNewLetterPopup = false;
  isInnerLeftMenuOpen = false;
  sessionId!: string;
  data: Array<any> = [
    {
      text: '',
    },
  ];
  public saveForLaterData = [
    {
      buttonType: "btn-h-primary",
      text: "Save For Later",
      icon: "save",
      click: (): void => {
        this.onSaveLaterClicked();
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "Discard Changes",
      icon: "do_disturb_alt",
      click: (): void => {
        this.onDiscardConfirmClicked()
      },
    },
    {
      buttonType: "btn-h-danger",
      text: "Delete Application",
      icon: "delete",
      click: (): void => {
        this.onDeleteConfirmClicked()
      },
    },

  ];

  routes$ = this.workflowFacade.routes$;
  completeStaus$ = this.workflowFacade.completionStatus$;
  currentSession = this.workflowFacade.currentSession
  constructor(
    private caseFacade: CaseFacade,
    private route: ActivatedRoute,
    private workflowFacade: WorkflowFacade,
    private loaderService: LoaderService
  ) {
  }

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadQueryParams();
    this.loadDdlCommonAction();
    this.addNavigationSubscription();
  }

  ngOnDestroy(): void {
    this.navigationSubscription.unsubscribe();
  }

  /** Private Methods */
  private loadQueryParams() {
    const workflowType: string = WorkflowTypeCode.NewCase;
    const entityId: string = this.route.snapshot.queryParams['eid'];
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkflowSession(workflowType, entityId, this.sessionId);
  }

  private loadDdlCommonAction() {
    this.caseFacade.loadDdlCommonActions();
  }

  private addNavigationSubscription() {
    this.navigationSubscription = this.workflowFacade.navigationTrigger$
      .pipe(
        mergeMap((navigationType: NavigationType) =>
          forkJoin(
            [
              of(navigationType),
              this.workflowFacade.saveWorkflowProgress(navigationType, this.sessionId, this.route.snapshot.queryParams['pid'])
            ])
        )
      )
      .subscribe({
        next: ([navigationType, Object]) => {
          const paramProcessId: string = this.route.snapshot.queryParams['pid'];
          if (paramProcessId) {
            this.workflowFacade.updateSequenceNavigation(navigationType, paramProcessId);
          }
        },
        error: (err: any) => {
          console.error('error', err);
        },
      });
  }

  /** Internal event methods **/
  onCloseSaveLaterClicked() {
    this.isShowSaveLaterPopup = false;
  }

  onSaveLaterClicked() {
    this.isShowSaveLaterPopup = true;
  }

  onCloseDeleteConfirmClicked() {
    this.isShowDeleteConfirmPopup = false;
  }

  onDeleteConfirmClicked() {
    this.isShowDeleteConfirmPopup = true;
  }

  onCloseDiscardConfirmClicked() {
    this.isShowDiscardConfirmPopup = false;
  }

  onDiscardConfirmClicked() {
    this.isShowDiscardConfirmPopup = true;
  }

  onSendNewLetterClicked() {
    this.isShowSendNewLetterPopup = true;
    this.isShowSaveLaterPopup = false;
  }

  /** External event methods **/
  handleCloseSendNewLetterClicked(event: CommunicationEvents) {
    if (event === CommunicationEvents.Close) {
      this.isShowSendNewLetterPopup = false;
    }
  }
  public onPaste(): void {
    console.log("Paste");
  }

  public closePreviewLetter() {
    this.openedPreviewLetter = false;
  }

  public openPreviewLetter() {
    this.openedPreviewLetter = true;
    this.openedSendNewLetter = false;
    this.openedSaveForLater = false;
    this.openedSendLetterToPrint = false;
  }

  public closeSaveForLater() {
    this.openedSaveForLater = false;
  }

  public openSaveForLater() {
    this.openedSaveForLater = true;
    this.openedSendNewLetter = false;
  }

  public closeSendLetterToPrint() {
    this.openedSendLetterToPrint = false;
  }

  public openSendLetterToPrint() {
    this.openedSendLetterToPrint = true;
    this.openedSendNewLetter = false;
    this.openedPreviewLetter = false;
  }

  onSaveAndContinueClicked() {
    this.workflowFacade.save(NavigationType.Next);
  }

  applyWorkflowChanges(object: any) {
    this.loaderService.show();
    if (object?.isReset ?? false) {
      this.workflowFacade.resetWorkflowNavigation();
      this.loaderService.hide();
    }
    else if (object?.route?.visitedFlag === StatusFlag.Yes || object?.isReview) {
      this.workflowFacade.saveNonequenceNavigation(object?.route?.workflowProgressId, this.sessionId ?? '')
        .subscribe(() => {
          this.loaderService.hide();
          this.workflowFacade.updateNonequenceNavigation(object?.route);
        });
    }
  }

  openInnerLeftMenu() {
    this.isInnerLeftMenuOpen = !this.isInnerLeftMenuOpen
  }
}
