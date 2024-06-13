/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  Input,
  ViewChild,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';

import {
  DrugPharmacyFacade,
  WorkflowFacade,
  PriorityCode,
} from '@cms/case-management/domain';

import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'case-management-set-as-primary-pharmacy',
  templateUrl: './set-as-primary-pharmacy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetAsPrimaryPharmacyComponent implements OnInit {
  @ViewChild('autocomplete') autocomplete: any;
  @Output() closeSelectNewPrimaryPharmacies = new EventEmitter();
  @Input() clientPharmacyDetails!: any;
  @Input() pharmacies: any[] = [];
  @Output() addNewPharmacyClick = new EventEmitter<any>();
  @Output() removePharmacyClick = new EventEmitter<any>();
  IsDeactivateSelectPrimaryPharmacies = false;
  isPharmacyError = false;
  selectedPharmacy: any;
  selectedVendorId: string = '';
  selectedSearchedPharmacy: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  pharmacysearchResult$ = this.drugPharmacyFacade.pharmacies$;
  searchLoaderVisibility$ = this.drugPharmacyFacade.searchLoaderVisibility$;
  selectedPharmacyForEdit!: string;
  copyPharmacies: any[] = [];
  pharmacysearchResultList: any[] = [];
  constructor(
    private readonly ref: ChangeDetectorRef,
    private drugPharmacyFacade: DrugPharmacyFacade,
    private workflowFacade: WorkflowFacade
  ) {}
  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.copyPharmacies = JSON.parse(JSON.stringify(this.pharmacies));

    this.pharmacies = this.pharmacies.filter(
      (pharmacy) =>
        pharmacy.priorityCode != PriorityCode.Primary &&
        pharmacy.activeFlag === 'Y'
    );
    this.pharmacysearchResult$.subscribe((list: any[]) => {
      this.pharmacysearchResultList = list;
      this.copyPharmacies.forEach((p) => {
        this.pharmacysearchResultList = this.pharmacysearchResultList.filter(
          (c) => c.vendorId != p.vendorId
        );
      });
    });
  }
  onCloseSelectNewPrimaryPharmaciesClicked() {
    this.closeSelectNewPrimaryPharmacies.emit();
  }
  searchPharmacies(searchText: string) {
    this.drugPharmacyFacade.searchPharmacies(searchText);
  }
  onChangePharmacy(selectedPharmacy: any) {
    this.IsDeactivateSelectPrimaryPharmacies = true;
    this.isPharmacyError = false;
    this.selectedPharmacy = this.pharmacies.find(
      (x) => x.vendorId == selectedPharmacy
    );
    this.selectedSearchedPharmacy = null;
    this.selectedPharmacyForEdit = '';
    this.autocomplete?.reset();
    this.ngDirtyInValid();
    this.ref.detectChanges();
  }
  onSearchTemplateClick(pharmacy: any) {
    this.IsDeactivateSelectPrimaryPharmacies = true;
    this.isPharmacyError = false;
    if (pharmacy.vendorId) {
      this.selectedSearchedPharmacy = pharmacy;
      this.selectedPharmacy = null;
      this.ngDirtyInValid();
      this.ref.detectChanges();
    }
  }
  onAddNewPharmacy() {
    if (!this.validate()) {
      this.isPharmacyError = true;
      this.ngDirtyInValid();
      return;
    }
    if (this.IsDeactivateSelectPrimaryPharmacies) {
      this.isPharmacyError = false;
      let isNewAdded = this.selectedSearchedPharmacy ? true : false;
      let newPharmacy = this.selectedSearchedPharmacy
        ? this.selectedSearchedPharmacy
        : this.selectedPharmacy;
      this.addNewPharmacyClick.emit({
        isNewAdded: isNewAdded,
        newPharmacy: newPharmacy,
      });
      this.ngDirtyInValid();
    } else {
      this.addNewPharmacyClick.emit(null);
    }
  }
  onRemovePharmacy() {
    if (!this.validate()) {
      this.isPharmacyError = true;
      this.ngDirtyInValid();
      return;
    }
    if (this.IsDeactivateSelectPrimaryPharmacies) {
      this.isPharmacyError = false;
      let isNewAdded = this.selectedSearchedPharmacy ? true : false;
      let newPharmacy = this.selectedSearchedPharmacy
        ? this.selectedSearchedPharmacy
        : this.selectedPharmacy;
      this.removePharmacyClick.emit({
        isNewAdded: isNewAdded,
        newPharmacy: newPharmacy,
      });
      this.ngDirtyInValid();
    } else {
      this.removePharmacyClick.emit(null);
    }
  }
  validate() {
    if (!this.selectedSearchedPharmacy && !this.selectedPharmacy) {
      return false;
    }
    return true;
  }

  ngDirtyInValid() {
    if (this.isPharmacyError) {
      document.getElementById('removePharmacy')?.classList.remove('ng-valid');
      document.getElementById('removePharmacy')?.classList.add('ng-invalid');
      document.getElementById('removePharmacy')?.classList.add('ng-dirty');
    }
    else {
      document.getElementById('removePharmacy')?.classList.remove('ng-invalid');
      document.getElementById('removePharmacy')?.classList.remove('ng-dirty');
      document.getElementById('removePharmacy')?.classList.add('ng-valid');
    }
  }
}
