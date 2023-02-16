/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
/** Facades **/
import { Pharmacy } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { Subject } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
@Component({
  selector: 'case-management-pharmacy-detail',
  templateUrl: './pharmacy-detail.component.html',
  styleUrls: ['./pharmacy-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyDetailComponent implements OnInit {
  /** Input properties **/
  @Input() isEditPharmacy!: boolean;
  @Input() selectedPharmacy: any;
  @Input() pharmacySearchResult$!: Observable<Pharmacy>;
  @Input() searchLoaderVisibility$!: Observable<boolean>;

  /** Output properties  **/
  @Output() closePharmacyEvent = new EventEmitter();
  @Output() searchPharmacyEvent = new EventEmitter<string>();
  @Output() addPharmacyEvent = new EventEmitter<string>();
  @Output() editPharmacyEvent = new EventEmitter<string>();
  @Output() removePharmacyEvent = new EventEmitter<string>();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  /** Public properties **/
  // pharmacies$ = this.drugPharmacyFacade.pharmacies$;
  // ddlStates$ = this.drugPharmacyFacade.ddlStates$;
  isOpenNewPharmacyClicked = false;
  filteredSelectedPharmacy!: any;
  pharmacyForm!: FormGroup;
  selectedPharmacyForEdit!: string;
  selectedPharmacyId!: string | null;
  showSelectPharmacyRequired = false;
  btnDisabled = false; 

  /** Lifecycle hooks **/
  ngOnInit(): void {
    if (this.isEditPharmacy) {
      this.selectedPharmacyForEdit = this.selectedPharmacy?.vendorFullName ?? '';
      this.selectedPharmacyId = this.selectedPharmacy?.vendorId;
    }
  }

  /** Private methods **/
  searchPharmacies(searchText: string) {
    this.selectedPharmacyId = null;
    this.searchPharmacyEvent.emit(searchText);
  }

  removePharmacy() {
    this.removePharmacyEvent.emit();
  }


  addOrEditPharmacy() {
    if (this.selectedPharmacyId) {
      this.btnDisabled = true
      if (this.isEditPharmacy) {
        this.editPharmacyEvent.emit(this.selectedPharmacyId ?? '');
      }
      else {
        this.addPharmacyEvent.emit(this.selectedPharmacyId ?? '');
      }
    }
    else{
      this.showSelectPharmacyRequired = true;
    }
  }

  /** Internal event methods **/
  onCloseNewPharmacyClicked() {
    this.closePharmacyEvent.emit();
    this.isOpenNewPharmacyClicked = false;
  }

  onOpenNewPharmacyClicked() {
    this.isOpenNewPharmacyClicked = true;
  }

  onClosePharmacyClicked() {
    this.closePharmacyEvent.emit();
  }

  onSearchTemplateClick(pharmacy: Pharmacy) {
    if(pharmacy.vendorId){
      this.selectedPharmacyId = pharmacy.vendorId;
      this.showSelectPharmacyRequired = false;
    }
    else{
      this.selectedPharmacyId = null;
    }
  }
}
