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
  racelov$ = this.lovFacade.racelov$;
  ethnicitylov$ = this.lovFacade.ethnicitylov$;

  raceAndEthnicityData: Array<any> = [];
  ethnicityData: Array<any> = [];
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
    this.lovFacade.getRaceLovs();
    this.lovFacade.getEthnicityLovs();
    this.loadEthnicity();
    this.loadRaceAndEthnicity();
    this.appInfoForm.addControl(
      'RaceAndEthnicityPrimary',
      new FormControl({})
    );
    this.appInfoForm.addControl(
      'Ethnicity',
      new FormControl([])
    );
  }
  private loadEthnicity() {
    this.ethnicitylov$.subscribe((data) => {
      this.ethnicityData=data;
    });
  }
  private loadRaceAndEthnicity() {
    this.racelov$.subscribe((data) => {
      if(data.length===0) return;
      
      console.log(data)
      let parents:any[]=[];
      data.forEach((el:any) => {
        parents.push(el[0]);
      });
      
      //const raceAndEthnicityDataGroup: Array<any> = [];
      // parents.forEach((el:any) => {
      //   data.filter(t=>t.).filter((m) => m.parentCode === el.lovCode)
      //     .forEach((child:any) => {
      //       raceAndEthnicityDataGroup.push({
      //         lovCode: child.lovCode,
      //         lovDesc: child.lovDesc,
      //         parentCode: el.lovCode,
      //       });
      //     });
      // });
      // debugger
      // this.raceAndEthnicityData = groupBy(raceAndEthnicityDataGroup, [
      //   { field: 'parentCode' },
      // ]);
      // this.RaceAndEthnicityData.emit(raceAndEthnicityDataGroup);
    });
  }

  public RaceAndEthnicityhange(value: any): void {
    if(Array.isArray(value) && value.length==1){
      this.appInfoForm.controls['RaceAndEthnicityPrimary']?.setValue(value[0]);
    }else{
      this.appInfoForm.controls['RaceAndEthnicityPrimary']?.setValue({});
    }
     // console.log('valueChange', value);
  }
}
