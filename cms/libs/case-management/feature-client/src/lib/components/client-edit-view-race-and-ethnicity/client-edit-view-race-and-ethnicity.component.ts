import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';
import { groupBy } from '@progress/kendo-data-query';

@Component({
  selector: 'case-management-client-edit-view-race-and-ethnicity',
  templateUrl: './client-edit-view-race-and-ethnicity.component.html',
})
export class ClientEditViewRaceAndEthnicityComponent implements OnInit {
  @Input() appInfoForm: FormGroup;
  @Input() raceAndEthnicityPrimaryData: Array<any>;
  @Input() raceAndEthnicityPrimaryNotListed: boolean;
  
  @Output() RaceAndEthnicityData = new EventEmitter<any>();
  @Output() RaceAndEthnicityChange = new EventEmitter<any>();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  racelov$ = this.lovFacade.racelov$;

  raceAndEthnicityData: Array<any> = [];
  ethnicityData: Array<any> = [];

  popupClassMultiSelect = 'multiSelectSearchPopup';
  constructor(
    private readonly lovFacade: LovFacade,
    private formBuilder: FormBuilder
  ) {
    this.appInfoForm = this.formBuilder.group({ RaceAndEthnicity: [[]] });
    this.raceAndEthnicityPrimaryData=[];
    this.raceAndEthnicityPrimaryNotListed=false;
  }
  ngOnInit(): void {
    this.lovFacade.getRaceLovs();
    this.loadRaceAndEthnicity();
    this.appInfoForm.addControl('RaceAndEthnicityPrimary', new FormControl({}));
    this.appInfoForm.addControl('Ethnicity', new FormControl([]));
    this.appInfoForm.addControl('RaceAndEthnicityNotListed', new FormControl(''));
  }
  private loadRaceAndEthnicity() {
    this.racelov$.subscribe((data) => {
      if (data.length === 0) return;

      let RaceData: Array<any> = [];
      const raceAndEthnicityData: Array<any> = [];
      this.ethnicityData=[];
      data.forEach((el: any) => {
        el.forEach((el2: any) => {
          raceAndEthnicityData.push(el2);
          if (el2.lovTypeCode === 'ETHNICITY') {
            this.ethnicityData.push(el2);
          } else {
            RaceData.push(el2);
          }
        });
      });
      const Parents = RaceData.filter((m) => m.parentCode === null);
      const raceAndEthnicityDataGroup: Array<any> = [];
      Parents.forEach((el) => {
        RaceData.filter((m) => m.parentCode === el.lovCode).forEach((child) => {
          raceAndEthnicityDataGroup.push({
            lovCode: child.lovCode,
            lovDesc: child.lovDesc,
            parentCode: el.lovDesc,
          });
        });
      });
      this.raceAndEthnicityData = groupBy(raceAndEthnicityDataGroup, [
        { field: 'parentCode' },
      ]);
      this.RaceAndEthnicityData.emit(raceAndEthnicityData);
    });
  }

  public RaceAndEthnicityhange(value: any): void {
    value.forEach((element: any) => {
      element.checked = true
    });
    this.RaceAndEthnicityChange.emit(true);
  }

  getCheckedItems(currentItem: any) {
    var values = this.appInfoForm.controls['RaceAndEthnicity']?.value;
    if (values.length > 0) {
      let item = values.find((x: any) => x.lovCode == currentItem.lovCode);
      if (item) {
        return true;
      }
    }
    return false;
  }
}
