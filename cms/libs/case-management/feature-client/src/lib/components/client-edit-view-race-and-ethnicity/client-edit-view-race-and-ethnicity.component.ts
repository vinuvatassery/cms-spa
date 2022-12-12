import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';
import { GroupResult, groupBy } from '@progress/kendo-data-query';

@Component({
  selector: 'case-management-client-edit-view-race-and-ethnicity',
  templateUrl: './client-edit-view-race-and-ethnicity.component.html',
  styleUrls: ['./client-edit-view-race-and-ethnicity.component.scss'],
})
export class ClientEditViewRaceAndEthnicityComponent implements OnInit {
  @Input() appInfoForm: FormGroup;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  raceAndEthnicitylov$ = this.lovFacade.raceAndEthnicitylov$;

  raceAndEthnicityData: Array<any> = [];
  primaryRacialData: Array<any> = [];
   
  popupClassMultiSelect = 'multiSelectSearchPopup';
  constructor(
    private readonly lovFacade: LovFacade,
    private formBuilder: FormBuilder
  ) {
    this.appInfoForm = this.formBuilder.group({ RaceAndEthnicity: [''] });
  }
  ngOnInit(): void {
    this.lovFacade.getRaceAndEthnicityLovs();
    this.loadRaceAndEthnicity();
  }
  private loadRaceAndEthnicity() {
    this.raceAndEthnicitylov$.subscribe((data) => {
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
    });
  }

  public RaceAndEthnicityhange(value: any): void {
    if(Array.isArray(value)){
      this.primaryRacialData=value;
      console.log('valueChange', value);
    }else{
      this.primaryRacialData=[];
    }
  }
}
