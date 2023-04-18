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
  PriorityCode
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
  selectedPharmacy: any;
  selectedVendorId: string = '';
  selectedSearchedPharmacy: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  pharmacysearchResult$ = this.drugPharmacyFacade.pharmacies$;
  searchLoaderVisibility$ = this.drugPharmacyFacade.searchLoaderVisibility$;
  selectedPharmacyForEdit!: string;
  constructor(
    private readonly ref: ChangeDetectorRef,
    private drugPharmacyFacade: DrugPharmacyFacade,
    private workflowFacade: WorkflowFacade
  ) {}
  onCloseSelectNewPrimaryPharmaciesClicked() {
    this.closeSelectNewPrimaryPharmacies.emit();
  }
  searchPharmacies(searchText: string) {
    this.drugPharmacyFacade.searchPharmacies(searchText);
  }
  onChangePharmacy(selectedPharmacy: any) {
    this.IsDeactivateSelectPrimaryPharmacies = true;
    this.selectedPharmacy = this.pharmacies.find(
      (x) => x.vendorId == selectedPharmacy
    );
    this.selectedSearchedPharmacy = null;
    this.selectedPharmacyForEdit = '';
    this.autocomplete?.reset();
    this.ref.detectChanges();
  }
  onSearchTemplateClick(pharmacy: any) {
    this.IsDeactivateSelectPrimaryPharmacies = true;
    if (pharmacy.vendorId) {
      this.selectedSearchedPharmacy = pharmacy;
      this.selectedPharmacy = null;
      this.selectedVendorId = '';
      this.ref.detectChanges();
    }
  }
  onAddNewPharmacy() {
    if (this.IsDeactivateSelectPrimaryPharmacies) {
      let isNewAdded = this.selectedSearchedPharmacy ? true : false;
      let newPharmacy = this.selectedSearchedPharmacy
        ? this.selectedSearchedPharmacy
        : this.selectedPharmacy;
      this.addNewPharmacyClick.emit({
        isNewAdded: isNewAdded,
        newPharmacy: newPharmacy,
      });
    }else {
      this.addNewPharmacyClick.emit(null);
    }
  }
  onRemovePharmacy() {
    if (this.IsDeactivateSelectPrimaryPharmacies){
      let isNewAdded = this.selectedSearchedPharmacy ? true : false;
      let newPharmacy = this.selectedSearchedPharmacy
      ? this.selectedSearchedPharmacy
      : this.selectedPharmacy;
      this.removePharmacyClick.emit({
        isNewAdded: isNewAdded,
        newPharmacy: newPharmacy,
      });
    }else {
      this.removePharmacyClick.emit(null);
    }
    
  }
}
