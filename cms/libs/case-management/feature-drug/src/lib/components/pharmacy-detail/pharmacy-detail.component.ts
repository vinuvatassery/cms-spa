/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
/** Facades **/
import { Pharmacy,DrugPharmacyFacade,PriorityCode } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { Observable } from 'rxjs';
@Component({
  selector: 'case-management-pharmacy-detail',
  templateUrl: './pharmacy-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyDetailComponent implements OnInit {
  /** Input properties **/
  @Input() isEditPharmacy!: boolean;
  @Input() selectedPharmacy: any;
  @Input() pharmacySearchResult$!: Observable<Pharmacy>;
  @Input() searchLoaderVisibility$!: Observable<boolean>;
  @Input() isNewPharmacyAdded = false;
  /** Output properties  **/
  @Output() closePharmacyEvent = new EventEmitter();
  @Output() searchPharmacyEvent = new EventEmitter<string>();
  @Output() addPharmacyEvent = new EventEmitter<string>();
  @Output() onEmitingSetAsPrimaryFlag = new EventEmitter<boolean>();
  @Output() editPharmacyEvent = new EventEmitter<string>();
  @Output() removePharmacyEvent = new EventEmitter<string>();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  /** Public properties **/
  isOpenNewPharmacyClicked = false;
  isSetAsPrimary = false;
  filteredSelectedPharmacy!: any;
  pharmacyForm!: FormGroup;
  selectedPharmacyForEdit!: string;
  selectedPharmacyId!: string | null;
  showSelectPharmacyRequired = false;
  btnDisabled = false; 
  constructor(private drugPharmacyFacade:DrugPharmacyFacade){

  }
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
    this.btnDisabled = false;
    this.searchPharmacyEvent.emit(searchText);
  }

  removePharmacy() {
    this.removePharmacyEvent.emit();
  }


  addOrEditPharmacy() {
    if(this.isSetAsPrimary){
      this.drugPharmacyFacade.durgPharmacyPrioritySubject.next(PriorityCode.Primary);
    }
    
    if (this.selectedPharmacyId) {
      this.btnDisabled = true
      if (this.isEditPharmacy) {

        this.editPharmacyEvent.emit(this.selectedPharmacyId ?? '');
      }
      else {
        this.onEmitingSetAsPrimaryFlag.emit(this.isSetAsPrimary);
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
