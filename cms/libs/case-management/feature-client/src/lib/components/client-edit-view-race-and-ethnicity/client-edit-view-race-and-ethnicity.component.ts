import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';
import {  ClientFacade} from '@cms/case-management/domain';
import { groupBy } from '@progress/kendo-data-query';

@Component({
  selector: 'case-management-client-edit-view-race-and-ethnicity',
  templateUrl: './client-edit-view-race-and-ethnicity.component.html',
  styleUrls: ['./client-edit-view-race-and-ethnicity.component.scss'],
})
export class ClientEditViewRaceAndEthnicityComponent implements OnInit {
  @Input() appInfoForm: FormGroup;
  @Output() RaceAndEthnicityData = new EventEmitter<any>();  
  public formUiStyle: UIFormStyle = new UIFormStyle();
  ethnicitylov$ = this.lovFacade.ethnicitylov$;

  raceAndEthnicityData: Array<any> = [];
  //primaryRacialData: Array<any> = [];
   
  popupClassMultiSelect = 'multiSelectSearchPopup';
  constructor(
    private readonly lovFacade: LovFacade,
    private formBuilder: FormBuilder,
    private readonly clientfacade: ClientFacade
  ) {
    this.appInfoForm = this.formBuilder.group({ RaceAndEthnicity: [[]] });
  }
  ngOnInit(): void {
    this.lovFacade.getEthnicityLovs();
    this.loadRaceAndEthnicity();
    this.appInfoForm.addControl(
      'RaceAndEthnicityPrimary',
      new FormControl({}, [Validators.required])
    );
  }
  private loadRaceAndEthnicity() {
    this.ethnicitylov$.subscribe((data) => {
      debugger
      //console.log(data, Parents);
      const Parents = data.filter((m) => m.parentCode === null);
      const raceAndEthnicityDataGroup: Array<any> = [];
      Parents.forEach((el) => {
        data
          .filter((m) => m.parentCode === el.lovCode)
          .forEach((child) => {
            raceAndEthnicityDataGroup.push({
              lovCode: child.lovCode,
              lovDesc: child.lovDesc,
              parentCode: el.lovCode,
            });
          });
      });
      this.raceAndEthnicityData = groupBy(raceAndEthnicityDataGroup, [
        { field: 'parentCode' },
      ]);
      this.RaceAndEthnicityData.emit(raceAndEthnicityDataGroup);
    });
  }

  // public RaceAndEthnicityhange(value: any): void {
  //     console.log('valueChange', value);
  // }
}
