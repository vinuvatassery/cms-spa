/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
/** Facades **/
import { DrugPharmacyFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa' 
@Component({
  selector: 'case-management-pharmacy-detail',
  templateUrl: './pharmacy-detail.component.html',
  styleUrls: ['./pharmacy-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyDetailComponent implements OnInit {
  /** Input properties **/
  @Input() isEditPharmacy!: boolean;
  @Input() selectedPharmacy!: any;

  /** Output properties  **/
  @Output() closePharmacyEvent = new EventEmitter();
  public formUiStyle : UIFormStyle = new UIFormStyle();
  /** Public properties **/
  pharmacies$ = this.drugPharmacyFacade.pharmacies$;
  ddlStates$ = this.drugPharmacyFacade.ddlStates$;
  isOpenNewPharmacyClicked = false;
  filteredSelectedPharmacy!: any;

  /** Constructor **/
  constructor(private readonly drugPharmacyFacade: DrugPharmacyFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadPharmacies();
    this.loadDdlStates();
  }

  /** Private methods **/
  private loadPharmacies() {
    this.drugPharmacyFacade.loadPharmacies();
    this.pharmacies$.subscribe({
      next: (pharmacies) => {
        if (this.isEditPharmacy) {
          this.filteredSelectedPharmacy = pharmacies.filter((pharmacy: any) => {
            return (
              this.selectedPharmacy.PharmacyNameAndNumber.indexOf(
                pharmacy.name
              ) !== -1
            );
          })[0];
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private loadDdlStates() {
    this.drugPharmacyFacade.loadDdlStates();
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
}
