/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
/** Facades **/
import { FamilyAndDependentFacade } from '@cms/case-management/domain';
/** External libraries **/
import { groupBy, GroupResult } from '@progress/kendo-data-query';

@Component({
  selector: 'case-management-family-and-dependent-detail',
  templateUrl: './family-and-dependent-detail.component.html',
  styleUrls: ['./family-and-dependent-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FamilyAndDependentDetailComponent implements OnInit {
  /** Input properties **/
  @Input() isOpenedEditFamilyMember = true;
  @Input() isAddFamilyMember = true;
 currentDate = new Date();
  /** Public properties **/
  dependentSearch$ = this.familyAndDependentFacade.dependentSearch$;
  ddlRelationships$ = this.familyAndDependentFacade.ddlRelationships$;
  isOpenedNewFamilyMember = false;
  dependentSearch!: GroupResult[];
  popupClass = 'k-autocomplete-custom';

  /** Constructor **/
  constructor(
    private readonly familyAndDependentFacade: FamilyAndDependentFacade,
    private readonly ref: ChangeDetectorRef
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDependentSearch();
    this.loadFamilyDependents();
    this.loadDdlRelationships();
  }

  /** Private methods **/
  private loadFamilyDependents() {
    this.familyAndDependentFacade.loadFamilyDependents();
    this.dependentSearch$.subscribe({
      next: (dependentSearch) => {
        this.dependentSearch = groupBy(dependentSearch, [
          { field: 'memberType' },
        ]);
      },
      error: (err) => {
        console.log('Error', err);
      },
    });
  }

  private loadDependentSearch() {
    this.familyAndDependentFacade.loadDependentSearch();
  }

  private loadDdlRelationships() {
    this.familyAndDependentFacade.loadDdlRelationships();
  }

  /** Internal event methods **/
  onNewFamilyMemberClosed() {
    this.isOpenedNewFamilyMember = false;
  }

  onNewFamilyMemberClicked() {
    this.isOpenedNewFamilyMember = true;
    this.ref.markForCheck();
  }
}
