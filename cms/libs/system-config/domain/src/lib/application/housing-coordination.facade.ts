
/** Angular **/
import { Injectable } from '@angular/core';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType, NotificationSource } from '@cms/shared/util-core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Data services **/
import { SystemConfigHousingCoordinationService } from '../infrastructure/housing-coordination.service';
import { SortDescriptor } from '@progress/kendo-data-query';

@Injectable({ providedIn: 'root' })
export class SystemConfigHousingCoordinationFacade {
  /** Private properties **/


  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueSlotsListGrid = 'creationTime'; 
  public sortSlotsListGrid: SortDescriptor[] = [{
    field: this.sortValueSlotsListGrid,
  }];
  public sortValueCaseAvailabilityListGrid = 'creationTime'; 
  public sortCaseAvailabilityListGrid: SortDescriptor[] = [{
    field: this.sortValueCaseAvailabilityListGrid,
  }];
  public sortValueEidLifeListGrid = 'creationTime'; 
  public sortCaseEidLifeListGrid: SortDescriptor[] = [{
    field: this.sortValueEidLifeListGrid,
  }];
  public sortValueHousingAcuityListGrid = 'creationTime'; 
  public sortHousingAcuityListGrid: SortDescriptor[] = [{
    field: this.sortValueHousingAcuityListGrid,
  }];
  public sortValueIncomeInclusionsListGrid = 'creationTime'; 
  public sortIncomeInclusionsListGrid: SortDescriptor[] = [{
    field: this.sortValueIncomeInclusionsListGrid,
  }];
  public sortValuePSMFRZIPListGrid = 'creationTime'; 
  public sortPSMFRZIPListGrid: SortDescriptor[] = [{
    field: this.sortValuePSMFRZIPListGrid,
  }];
  public sortValueRegionAssignmentListGrid = 'creationTime'; 
  public sortRegionAssignmentListGrid: SortDescriptor[] = [{
    field: this.sortValueRegionAssignmentListGrid,
  }];
  public sortValueServiceProviderListGrid = 'creationTime'; 
  public sortServiceProviderListGrid: SortDescriptor[] = [{
    field: this.sortValueServiceProviderListGrid,
  }];
  private slotsSubject = new BehaviorSubject<any>([]);
  private caseAvailabilitiesSubject = new BehaviorSubject<any>([]);     
  private housingAcuityLevelSubject = new BehaviorSubject<any>([]);
  private incomeInclusionsExclusionsSubject = new BehaviorSubject<any>([]);
  private regionAssignmentSubject = new BehaviorSubject<any>([]);
  private pSMFRZIPSubject = new BehaviorSubject<any>([]);
  private serviceProviderSubject = new BehaviorSubject<any>([]);
 
 
  /** Public properties **/
  private PeriodsSubject = new BehaviorSubject<any>([]);
 slots$ = this.slotsSubject.asObservable();
  caseAvailabilities$ =
    this.caseAvailabilitiesSubject.asObservable();
  housingAcuityLevel$ = this.housingAcuityLevelSubject.asObservable();
  incomeInclusionsExclusions$ = this.incomeInclusionsExclusionsSubject.asObservable();
  regionAssignment$ = this.regionAssignmentSubject.asObservable();
  pSMFRZIP$ = this.pSMFRZIPSubject.asObservable();
  serviceProvider$ = this.serviceProviderSubject.asObservable();
  Periods$ = this.PeriodsSubject.asObservable();
  
  /** Constructor **/
  constructor(private readonly systemConfigHousingCoordinationService: SystemConfigHousingCoordinationService,
    private loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly loaderService: LoaderService,
    private readonly configurationProvider: ConfigurationProvider,
    ) {}


    showHideSnackBar(type : SnackBarNotificationType , subtitle : any, title : string = '')
    {
        if(type == SnackBarNotificationType.ERROR)
        {
          const err= subtitle;
          this.loggingService.logException(err)
        }
          this.notificationSnackbarService.manageSnackBar(type, subtitle, NotificationSource.API, title)
          this.hideLoader();
    }

    showLoader()
    {
      this.loaderService.show();
    }

    hideLoader()
    {
      this.loaderService.hide();
    }

  /** Public methods **/
 
 
 

  loadSlots() {
    this.systemConfigHousingCoordinationService.loadClientProfileSlots().subscribe({
      next: (response) => {
        this.slotsSubject.next(response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadClientProfileCaseAvailabilities() {
    this.systemConfigHousingCoordinationService.loadClientProfileCaseAvailabilities().subscribe({
      next: (response) => {
        this.caseAvailabilitiesSubject.next(
          response
        );
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

 
 
  loadHousingAcuityLevelList(){
    this.systemConfigHousingCoordinationService.loadHousingAcuityLevelList().subscribe({
      next: (response) => {
        this.housingAcuityLevelSubject.next(response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }
  loadIncomeInclusionsExlusionsList(){
    this.systemConfigHousingCoordinationService.loadIncomeInclusionsExlusionsList().subscribe({
      next: (response) => {
        this.incomeInclusionsExclusionsSubject.next(response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadRegionAssignmentList(){
    this.systemConfigHousingCoordinationService.loadRegionAssignmentList().subscribe({
      next: (response) => {
        this.regionAssignmentSubject.next(response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }
  loadPSMFRZIPList(){
    this.systemConfigHousingCoordinationService.loadPSMFRZIPList().subscribe({
      next: (response) => {
        this.pSMFRZIPSubject.next(response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadServiceProviderList(){
    this.systemConfigHousingCoordinationService.loadServiceProviderList().subscribe({
      next: (response) => {
        this.serviceProviderSubject.next(response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }
  loadPeriods() {
    this.systemConfigHousingCoordinationService.loadPeriods().subscribe({
      next: (response) => {
        this.PeriodsSubject.next(response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }
 
}
