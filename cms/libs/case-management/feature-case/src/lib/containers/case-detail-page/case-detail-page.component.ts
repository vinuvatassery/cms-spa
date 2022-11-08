/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
/** Enums **/
import { WorkflowFacade, CommunicationEvents, CompletionStatusFacade, ScreenFlowType, ScreenType, NavigationType, Workflow } from '@cms/case-management/domain';
/** Facades **/
import { CaseFacade } from '@cms/case-management/domain';
import {
  DateInputSize,
  DateInputRounded,
  DateInputFillMode,
} from '@progress/kendo-angular-dateinputs';
import { forkJoin, mergeMap, of, Subscription } from 'rxjs';
/**Services**/

@Component({
  selector: 'case-management-case-detail-page',
  templateUrl: './case-detail-page.component.html',
  styleUrls: ['./case-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseDetailPageComponent implements OnInit, OnDestroy {

  /**Private properties**/
  private navigationSubscription !: Subscription;

  public size: DateInputSize = 'medium';
  public rounded: DateInputRounded = 'full';
  public fillMode: DateInputFillMode = 'outline';

  /**Public properties**/
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
  completeStaus$ = this.completionStatusFacade.completionStatus$;

  constructor(
    private caseFacade: CaseFacade,
    private route: ActivatedRoute,
    private navRoute: Router,
    private completionStatusFacade: CompletionStatusFacade,
    private workflowFacade: WorkflowFacade
  ) { }

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
    let paramScreenFlowType: string;
    let paramSessionId: any;
    let paramEntityId: any;
    this.route.queryParamMap.subscribe({
      next: (params) => {
        paramScreenFlowType = params.get('type') as ScreenFlowType;
        paramSessionId = params.get('sid');
        paramEntityId = params.get('eid');
        this.loadRoutes(
          paramScreenFlowType,
          paramEntityId,
          paramSessionId
        );
        if (paramSessionId) {
          this.routes$.subscribe({
            next: (routes) => {
              if (routes?.length > 0) {
                this.navRoute.navigate(
                  [
                    routes.filter(
                      (route: any) => route?.workFlowProgress?.currentFlag === 'Y'
                    )[0].url,
                  ],
                  {
                    queryParams: {
                      type: paramScreenFlowType,
                      sid: paramSessionId,
                      eid: paramEntityId,
                    },
                  }
                );
              }
            },
            complete: () => {
              console.log('Completed');
            },
          });
        }

      },
      error: (err) => {
        console.log('Error', err);
      },
    });
  }

  private loadRoutes(
    screen_flow_type_code: string,
    entity_id: string,
    session_id?: string
  ) {
    this.workflowFacade.loadRoutes(screen_flow_type_code, entity_id, session_id);
  }

  private loadCompletionStatus(caseId?: number) {
    this.completionStatusFacade.loadCompletionStatus(caseId);
  }

  private loadDdlCommonAction() {
    this.caseFacade.loadDdlCommonActions();
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

  onSaveAndContinueClicked() {
    this.workflowFacade.save(NavigationType.Next);
  }

  private addNavigationSubscription() {
    this.navigationSubscription = this.workflowFacade.navigationTrigger$
      .pipe(
        mergeMap((navigationType: NavigationType) =>
          forkJoin(
            [
              of(navigationType),
              this.workflowFacade.saveWorkflowProgress(navigationType)
            ])
        )
      )
      .subscribe({
        next: ([navigationType, Object]) => {
          this.workflowFacade.updateSequenceNavigation(navigationType);
        },
        error: (err: any) => {
          console.error('error', err);
        },
      });
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

  applyWorkflowChanges(route: Workflow) {
    if (route?.workFlowProgress?.visitedFlag === 'Y') {
      this.workflowFacade.updateNonequenceNavigation(route).subscribe();
    }
  }

}
