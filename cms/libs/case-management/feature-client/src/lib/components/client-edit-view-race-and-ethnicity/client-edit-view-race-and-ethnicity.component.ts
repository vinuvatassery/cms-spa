import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';
import { ClientFacade } from '@cms/case-management/domain';
import { groupBy } from '@progress/kendo-data-query';

@Component({
  selector: 'case-management-client-edit-view-race-and-ethnicity',
  templateUrl: './client-edit-view-race-and-ethnicity.component.html',
  styleUrls: ['./client-edit-view-race-and-ethnicity.component.scss'],
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
  isNotListed: boolean = false;

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
      console.log(this.raceAndEthnicityData);
      this.RaceAndEthnicityData.emit(raceAndEthnicityData);
    });
  }

  public RaceAndEthnicityhange(value: any): void {
    let notListedValue: any = {};
    value.forEach((val:any)=>{
      if(val.lovCode === "NOT_LISTED") {
        this.isNotListed = true;
        notListedValue = val;
      }
    });
    if (this.isNotListed && Object.keys(notListedValue).length > 0) {
      this.appInfoForm.get('RaceAndEthnicity')?.setValue([notListedValue]);
    }
    else {
      this.isNotListed = false;
    }
    this.RaceAndEthnicityChange.emit(true);
    // if (Array.isArray(value) && value.length == 1) {
    //   this.appInfoForm.controls['RaceAndEthnicityPrimary']?.setValue(value[0]);
    // } else {
    //   this.appInfoForm.controls['RaceAndEthnicityPrimary']?.setValue({});
    // }
    // console.log('valueChange', value);

  }
}
