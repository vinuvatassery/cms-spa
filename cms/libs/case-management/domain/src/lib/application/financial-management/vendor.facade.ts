/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject, Subject } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';


/** Internal libraries **/
import { ConfigurationProvider, LoggingService, NotificationSnackbarService, SnackBarNotificationType, LoaderService } from '@cms/shared/util-core';
import { FinancialVendorDataService } from '../../infrastructure/financial-management/vendor.data.service';
import { FinancialVendorTypeCode } from '@cms/shared/ui-common';
import { Pharmacy } from '../../entities/client-pharmacy';
import { UserManagementFacade } from '@cms/system-config/domain';

@Injectable({ providedIn: 'root' })
export class FinancialVendorFacade {

  /** Private properties **/
  private vendorsSubject = new Subject<any>();
  private selectedVendorSubject = new Subject<any>();
  private vendorProfileSubject = new Subject<any>();
  private vendorProfileForReminderPanelSubject = new Subject<any>();
  private vendorProfileSpecialHandlingSubject = new Subject<any>();
  private clinicVendorSubject = new Subject<any>();
  private clinicVendorLoaderSubject = new Subject<any>();  /** Public properties **/
  private providePanelSubject = new Subject<any>();
  private updateProviderPanelSubject = new Subject<any>();
  private addProviderNewSubject = new Subject<any>();
  public searchProviderSubject = new Subject<any>();
  private removeprovidersubject = new Subject<any>();
  searchProvider$ = this.searchProviderSubject.asObservable();
  removeprovider$ = this.removeprovidersubject.asObservable();
  addProviderNew$ = this.addProviderNewSubject.asObservable();
  vendorsList$ = this.vendorsSubject.asObservable();
  selectedVendor$ = this.selectedVendorSubject.asObservable();
  vendorProfile$ = this.vendorProfileSubject.asObservable();
  vendorProfileForReminderPanel$ = this.vendorProfileForReminderPanelSubject.asObservable();
  clinicVendorList$ = this.clinicVendorSubject.asObservable();
  clinicVendorLoader$ = this.clinicVendorLoaderSubject.asObservable();
  providePanelSubject$ = this.providePanelSubject.asObservable();
  updateProviderPanelSubject$ = this.updateProviderPanelSubject.asObservable();
  vendorProfileSpecialHandling$ = this.vendorProfileSpecialHandlingSubject.asObservable();

  private vendorsListSubject = new BehaviorSubject<any>([]);
  vendorDetails$ = this.vendorsListSubject.asObservable();

  public manufacturerListSubject = new Subject<any>();
  manufacturerList$ = this.manufacturerListSubject.asObservable();

  private medicalProviderSearchLoaderVisibilitySubject = new Subject<boolean>;
  medicalProviderSearchLoaderVisibility$ = this.medicalProviderSearchLoaderVisibilitySubject.asObservable();
  public insuranceVendorsSubject = new Subject<any>;
  insuranceVendors$ = this.insuranceVendorsSubject.asObservable();


  private providerListSubject = new Subject<any>();
  providerList$ = this.providerListSubject.asObservable();
  public selectedVendorType = FinancialVendorTypeCode.Manufacturers
  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public sortValue = 'vendorName'
  public sortType = 'asc'
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
  }];
  financialClinicProviderProfileSubject = new Subject();

  /** Constructor**/
  constructor(private readonly financialVendorDataService: FinancialVendorDataService,
    private readonly loaderService: LoaderService,
    private configurationProvider: ConfigurationProvider,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly userManagementFacade: UserManagementFacade,
  ) { }

  /** Public methods **/
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
  searchProvidorsById(vendoraddressId: string) {
    this.medicalProviderSearchLoaderVisibilitySubject.next(true);
    return this.financialVendorDataService.searchProvidorsById(vendoraddressId).subscribe({
      next: (response: Pharmacy[]) => {
        response?.forEach((vendor: any) => {
          vendor.providerFullName = `${vendor.vendorName ?? ''} ${vendor.tin ?? ''} ${vendor.mailCode ?? ''}${vendor.vendorAddress ?? ''}`;
        });
        this.insuranceVendorsSubject.next(response);
        this.medicalProviderSearchLoaderVisibilitySubject.next(false);
      },
      error: (err) => {
        this.medicalProviderSearchLoaderVisibilitySubject.next(false);
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      }
    });
  }
  searchInsurnaceVendor(searchText: string) {
    this.medicalProviderSearchLoaderVisibilitySubject.next(true);
    return this.financialVendorDataService.searchInsurnaceVendor(searchText).subscribe({
      next: (response: Pharmacy[]) => {
        response?.forEach((vendor: any) => {
          vendor.providerFullName = `${vendor.vendorName ?? ''} ${vendor.tin ?? ''} ${vendor.mailCode ?? ''}${vendor.vendorAddress ?? ''}`;
        });
        this.insuranceVendorsSubject.next(response);
        this.medicalProviderSearchLoaderVisibilitySubject.next(false);
      },
      error: (err) => {
        this.medicalProviderSearchLoaderVisibilitySubject.next(false);
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      }
    });
  }

  getVendors(skipcount: number, maxResultCount: number, sort: string, sortType: string, vendorTypeCode: string, filter: string): void {
    filter = JSON.stringify(filter);
    this.financialVendorDataService.getVendors(skipcount, maxResultCount, sort, sortType, vendorTypeCode, filter).subscribe({
      next: (vendorsResponse: any) => {
        if (vendorsResponse) {
          const gridView = {
            data: vendorsResponse["items"],
            total: vendorsResponse["totalCount"]
          };
          this.vendorsSubject.next(gridView);
        }

      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }
  getVendorProfile(vendorId: string, tabCode: string): void {
    this.showLoader();
    this.financialVendorDataService.getVendorProfile(vendorId, tabCode).subscribe({
      next: (vendorResponse: any) => {
        if (vendorResponse) {
          this.vendorProfileSubject.next(vendorResponse);
          this.hideLoader();
        }
      },
      error: (err) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }

  getVendorProfileForReminderPanel(vendorId: string, tabCode: string): void {
    this.financialVendorDataService.getVendorProfile(vendorId, tabCode).subscribe({
      next: (vendorResponse: any) => {
        if (vendorResponse) {
          this.vendorProfileForReminderPanelSubject.next(vendorResponse);
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }

  addVendorRecentlyViewed(vendorId :any){
    this.showLoader();
    this.financialVendorDataService.addVendorRecentlyViewed(vendorId).subscribe({
      next: (vendorResponse: any) => {
        if (vendorResponse) {
          this.hideLoader();
        }
      },
      error: (err) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }
  getVendorProfileSpecialHandling(vendorId: string): void {
    this.financialVendorDataService.getVendorProfileSpecialHandling(vendorId).subscribe({
      next: (vendorHandlingResponse: any) => {
        if (vendorHandlingResponse) {
          this.vendorProfileSpecialHandlingSubject.next(vendorHandlingResponse);
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }

  getVendorDetails(vendorId: string, isActive: boolean = true) {
    this.showLoader();
    this.financialVendorDataService.getVendorDetails(vendorId, isActive).subscribe({
      next: (vendorDetail: any) => {
        this.selectedVendorSubject.next(vendorDetail);
        this.hideLoader();
      },
      error: (err) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      }
    });
  }

  getProviderPanel(paymentRequestId: string) {
    this.showLoader();
    this.financialVendorDataService.getProviderPanel(paymentRequestId).subscribe({
      next: (vendorsResponse: any) => {
        if (vendorsResponse) {
          this.providePanelSubject.next(vendorsResponse);
          this.hideLoader();
        }
      },
      error: (err) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }

  getProviderPanelByVendorAddressId(vendorAddressId: string) {
    this.showLoader();
    this.financialVendorDataService.getProviderPanelByVendorAddressId(vendorAddressId).subscribe({
      next: (vendorsResponse: any) => {
        if (vendorsResponse) {
          this.providePanelSubject.next(vendorsResponse);
          this.hideLoader();
        }
      },
      error: (err) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }

  updateProviderPanel(ProviderPanelDto: any) {
    this.showLoader();
    return this.financialVendorDataService.updateProviderPanel(ProviderPanelDto).subscribe({
      next: (updatedResponse: any) => {
        if (updatedResponse) {
          this.updateProviderPanelSubject.next(updatedResponse);
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Updated successfully')
          this.hideLoader();
        }
      },
      error: (err) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    })
  }

  getProviderPanelByVendorId(vendorId: string) {
    this.showLoader();
    this.financialVendorDataService.getProviderPanelByVendorId(vendorId).subscribe({
      next: (vendorsResponse: any) => {
        if (vendorsResponse) {
          this.providePanelSubject.next(vendorsResponse);
          this.hideLoader();
        }
      },
      error: (err) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }
  updateManufacturerProfile(vendorProfile: any) {
    return this.financialVendorDataService.updateManufacturerProfile(vendorProfile);
  }
  addVendorProfile(vendorProfile: any) {
    return this.financialVendorDataService.addVendorProfile(vendorProfile);
  }

  searchClinicVendor(vendorName: any) {
    this.clinicVendorLoaderSubject.next(true);
    this.clinicVendorSubject.next(null);
    this.financialVendorDataService.searchClinicVendors(vendorName).subscribe({
      next: (vendorsResponse: any) => {
        if (vendorsResponse) {
          this.clinicVendorSubject.next(vendorsResponse);
          this.clinicVendorLoaderSubject.next(false);
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }

  loadVendorList(searchText:any): void {
    this.showLoader();
    this.financialVendorDataService.loadVendorList(searchText).subscribe({
      next: (reponse: any) => {
        if (reponse) {
          this.hideLoader();
          this.vendorsListSubject.next(reponse);
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadManufacturersList(): void {
    this.showLoader();
    this.financialVendorDataService.loadVendorList(FinancialVendorTypeCode.Manufacturers).subscribe({
      next: (reponse: any) => {
        if (reponse) {
          this.hideLoader();
          this.manufacturerListSubject.next(reponse);
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  getProviderList(providerPageAndSortedRequest: any) {

    this.showLoader();
    this.financialVendorDataService.getProvidersList(providerPageAndSortedRequest).subscribe({
      next: (response: any) => {
        if (response) {
          const gridView = {
            data: response["items"],
            total: response["totalCount"]
          };
          this.hideLoader();
          this.providerListSubject.next(gridView);
          this.loadProviderDistinctUserIdsAndProfilePhoto(response["items"]);
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadProviderDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.financialClinicProviderProfileSubject.next(data);
          }
        },
      });
    }
  } 

  searchProvider(payload: any) {
    this.showLoader();
    return this.financialVendorDataService.searchProvider(payload).subscribe({
      next: (response: any[]) => {
        this.searchProviderSubject.next(response);
        this.hideLoader();
      },
      error: (err) => {
        this.hideLoader();
        this.showHideSnackBar(
          SnackBarNotificationType.ERROR,
          err
        );
        this.loggingService.logException(err);
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }

  searchAllProvider(payload: any) {
    this.medicalProviderSearchLoaderVisibilitySubject.next(true)
  
    return this.financialVendorDataService.searchProvider(payload).subscribe({
      next: (response: any[]) => {
        this.medicalProviderSearchLoaderVisibilitySubject.next(false)
        this.searchProviderSubject.next(response);
      },
      error: (err) => {
        this.showHideSnackBar(
          SnackBarNotificationType.ERROR,
          err
        );
        this.loggingService.logException(err);
        this.medicalProviderSearchLoaderVisibilitySubject.next(false)     
      },
    });
  }
  removeProvider(providerId: any): void {
    this.showLoader();
    this.financialVendorDataService.removeprovider(providerId).subscribe({
      next: (deleteResponse) => {
        if (deleteResponse ?? false) {
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, deleteResponse.message)
          this.removeprovidersubject.next(deleteResponse)
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      }
    });
  }
  addProvider(provider: any) {
    this.showLoader();
    this.financialVendorDataService.addProvider(provider).subscribe({
      next: (addNewdependentsResponse: any) => {
        if (addNewdependentsResponse) {
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, addNewdependentsResponse.message)
        }
        this.addProviderNewSubject.next(addNewdependentsResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }

  updateVendorProfile(ProviderPanelDto: any) {
    this.showLoader();
    return this.financialVendorDataService.updateVendorProfile(ProviderPanelDto).subscribe({
      next: (updatedResponse: any) => {
        if (updatedResponse) {
          this.updateProviderPanelSubject.next(updatedResponse);
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, updatedResponse.Message)
          this.hideLoader();
        }
      },
      error: (err) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    })
  }

  validateTinNbr(tinNbr: any) {
    return this.financialVendorDataService.getValidateTinNbr(tinNbr);
  }

  loadVendors(searchText:any,vendorTypeCode:any){
    this.clinicVendorLoaderSubject.next(true);
    this.financialVendorDataService.loadVendors(searchText,vendorTypeCode).subscribe({
      next: (reponse: any) => {
        if (reponse) {
          this.clinicVendorLoaderSubject.next(false);
          this.vendorsListSubject.next(reponse);
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.clinicVendorLoaderSubject.next(false);
      },
    });
  }

}
