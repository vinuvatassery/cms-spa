import { Component, OnInit,Input , ChangeDetectorRef, ChangeDetectionStrategy,  OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LovFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { first, tap } from 'rxjs';
import { DropDownFilterSettings  } from '@progress/kendo-angular-dropdowns';




@Component({
  selector: 'case-management-client-edit-view-disability',
  templateUrl: './client-edit-view-disability.component.html',
  styleUrls: ['./client-edit-view-disability.component.scss'],
  
})
export class ClientEditViewDisabilityComponent implements OnInit {

  @Input() appInfoForm: FormGroup;
  @Input() materialsyeslov! : any;
  @Input() materialOptionButtonValid!:boolean;
  @Input() yesMaterialDisable!:boolean;
  rdoMaterials$ = this.lovFacade.materialslov$;
  materialsyeslov$ = this.lovFacade.materialsyeslov$;
  materialList: any = [];
  yesMaterialList: any =[]; 
 

  public formUiStyle : UIFormStyle = new UIFormStyle();  
  public caseOwnerfilterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "startsWith",
  };
  constructor(private formBuilder: FormBuilder,
    private readonly lovFacade : LovFacade) {
      this.appInfoForm = this.formBuilder.group({Material: [''],});
    }

  ngOnInit(): void {
    this.lovFacade.getMaterialLovs();
    this.lovFacade.getMaterialYesLovs();
    this.loadYesMaterial();
    this.yesMaterialDisable = true;
   
  }
  private loadMaterials(){
    this.rdoMaterials$.subscribe((data) => {
      this.materialList = data;    
      // data.forEach((element) => {
      //     this.appInfoForm.addControl(element.lovCode, new FormControl(''));
       
      // });
    });
   
   }
   private loadYesMaterial(){
    this.materialsyeslov$.subscribe((data) => {
      this.yesMaterialList = data;   
      this.loadMaterials();
      });   
   }
    onMaterialsRdoClicked(event: any) {
      debugger;
      if( this.appInfoForm.controls['selectedMaterial'].value.toUpperCase() ==='YES'){
        this.yesMaterialDisable = false;
      }
      else{
        this.yesMaterialDisable = true;
      } 

      if(this.appInfoForm.controls['selectedMaterial'].value.toUpperCase()  ==='YES' && (this.appInfoForm.controls['yesMaterial'].value === ''
      || this.appInfoForm.controls['yesMaterial'].value === null)){
        this.appInfoForm.controls['yesMaterial'].setValidators(Validators.required);
        this.appInfoForm.controls['yesMaterial'].updateValueAndValidity();
        this.appInfoForm.controls['selectedMaterial'].removeValidators(Validators.required);
        this.appInfoForm.controls['selectedMaterial'].updateValueAndValidity();
      }
      else{
        this.appInfoForm.controls['yesMaterial'].removeValidators(Validators.required);
        this.appInfoForm.controls['yesMaterial'].updateValueAndValidity();
        // this.appInfoForm.controls['selectedMaterial'].removeValidators(Validators.required);
        // this.appInfoForm.controls['selectedMaterial'].updateValueAndValidity();
      }
  }
}
