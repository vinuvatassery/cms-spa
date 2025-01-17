import { Injectable } from '@angular/core';
/** External libraries **/
import {  BehaviorSubject, Subject } from 'rxjs';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';

/** Internal libraries **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { PcaAssignmentsDataService } from '../../infrastructure/financial-management/pca-assignments.data.service';

@Injectable({ providedIn: 'root' })

export class PcaAssignmentsFacade {

    private objectCodesDataSubject = new Subject<any>();
    objectCodesData$ = this.objectCodesDataSubject.asObservable();

    private groupCodesDataSubject = new BehaviorSubject<any>([]);
    groupCodesData$ = this.groupCodesDataSubject.asObservable();

    private pcaCodesDataSubject = new BehaviorSubject<any>([]);
    pcaCodesData$ = this.pcaCodesDataSubject.asObservable();

    private pcaCodesInfoDataSubject = new Subject<any>();
    pcaCodesInfoData$ = this.pcaCodesInfoDataSubject.asObservable();

    private pcaDatesDataSubject = new Subject<any>();
    pcaDatesData$ = this.pcaDatesDataSubject.asObservable();

    private pcaDatesVaidationSubject = new Subject<any>();
    pcaDatesValidation$ = this.pcaDatesVaidationSubject.asObservable();

    private assignPcaResponseDataSubject = new Subject<any>();
    assignPcaResponseData$ = this.assignPcaResponseDataSubject.asObservable();

    private reassignPcaResponseDataSubject = new Subject<any>();
    reassignPcaResponseData$ = this.reassignPcaResponseDataSubject.asObservable();
    
    private editAssignedPcaResponseDataSubject = new Subject<any>();
    editAssignedPcaResponseData$ = this.editAssignedPcaResponseDataSubject.asObservable();

    private pcaAssignmentDataSubject = new Subject<any>();
    pcaAssignmentData$ = this.pcaAssignmentDataSubject.asObservable();

    private financialPcaAssignmentDataSubject = new Subject<any>();
    financialPcaAssignmentData$ = this.financialPcaAssignmentDataSubject.asObservable();

    private pcaAssignmentPriorityUpdateSubject = new Subject<any>();
    pcaAssignmentPriorityUpdate$ = this.pcaAssignmentPriorityUpdateSubject.asObservable();
    private pcaAssignmentGridArgumentsData : any
  /** Public properties **/
 
  // handling the snackbar & loader
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>(); 

  showLoader() { this.loaderService.show(); }
  hideLoader() { this.loaderService.hide(); }

  errorShowHideSnackBar( subtitle : any)
  {
    this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR,subtitle, NotificationSource.UI)
  }
  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
    this.hideLoader();
  }

  /** Constructor**/
  constructor(
    public pcaAssignmentsDataService: PcaAssignmentsDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) { }

  pcaAssignmentPriorityUpdate(pcaAssignmentPriorityArguments :any) {
    this.pcaAssignmentsDataService.pcaAssignmentPriorityUpdate(pcaAssignmentPriorityArguments).subscribe({
      next: (updatedResponse) => {       
        this.pcaAssignmentPriorityUpdateSubject.next(updatedResponse);
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS, updatedResponse?.message)
        this.loadFinancialPcaAssignmentListGrid(this.pcaAssignmentGridArgumentsData)
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }

  loadFinancialPcaAssignmentListGrid(pcaAssignmentGridArguments :any) {
    this.pcaAssignmentGridArgumentsData = pcaAssignmentGridArguments
    this.pcaAssignmentsDataService.loadFinancialPcaAssignmentListService(pcaAssignmentGridArguments).subscribe({
      next: (dataResponse) => {    
        this.financialPcaAssignmentDataSubject.next(dataResponse['items']);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }

  loadObjectCodes(){
    this.pcaAssignmentsDataService.loadObjectCodes().subscribe({
      next: (dataResponse) => {        
        this.objectCodesDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  } 
  
  loadGroupCodes(){
    this.pcaAssignmentsDataService.loadGroupCodes().subscribe({
      next: (dataResponse) => {
        this.groupCodesDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  } 

  loadPcaCodes(){
    this.pcaAssignmentsDataService.loadPcaCodes().subscribe({
      next: (dataResponse) => {
        this.pcaCodesDataSubject.next(dataResponse);
        this.pcaCodesInfoDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  } 

  loadPcaDates(assignmentId :any = null){
    this.pcaAssignmentsDataService.loadPcaDates(assignmentId).subscribe({
      next: (dataResponse) => {
        this.pcaDatesDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }
  
  validatePcaDates(pcaAssignmentId:any, pcaAssignmentDates:any){
    this.showLoader();
    this.pcaAssignmentsDataService.validatePcaDates(pcaAssignmentId,pcaAssignmentDates).subscribe({
      next: (dataResponse) => {
        this.pcaDatesVaidationSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }
  
  assignPca(assignPcaRequest : any){
    this.showLoader();
    return this.pcaAssignmentsDataService.assignPca(assignPcaRequest).subscribe({
      next: (updatedResponse: any) => {
        if (updatedResponse) {
          this.assignPcaResponseDataSubject.next(updatedResponse);            
         this.showHideSnackBar(SnackBarNotificationType.SUCCESS, updatedResponse?.message)
          this.hideLoader();      
        }
      },
      error: (err) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    })
  }
  reassignPca(assignPcaRequest : any){
    
    this.showLoader();
    return this.pcaAssignmentsDataService.reassignPca(assignPcaRequest).subscribe({
      next: (updatedResponse: any) => {        
        if (updatedResponse) {
          this.reassignPcaResponseDataSubject.next(updatedResponse);            
         this.showHideSnackBar(SnackBarNotificationType.SUCCESS, updatedResponse?.message)
          this.hideLoader();      
        }
      },
      error: (err) => {
        
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    })
  }

  editAssignedPca(assignPcaRequest : any){
    this.showLoader();
    return this.pcaAssignmentsDataService.editAssignedPca(assignPcaRequest).subscribe({
      next: (updatedResponse: any) => {
        if (updatedResponse) {
          this.assignPcaResponseDataSubject.next(updatedResponse);       
          
          if(updatedResponse?.status === 2)
          {
            this.showHideSnackBar(SnackBarNotificationType.WARNING, updatedResponse?.message)
          }
          else
          {
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, updatedResponse?.message)
          }
          this.hideLoader();      
        }
      },
      error: (err) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    })
  }

  getPcaAssignment(pcaAssignmentId : string){
    this.showLoader()
    this.pcaAssignmentsDataService.getPcaAssignment(pcaAssignmentId).subscribe({
      next: (dataResponse) => {
        this.pcaAssignmentDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }
}