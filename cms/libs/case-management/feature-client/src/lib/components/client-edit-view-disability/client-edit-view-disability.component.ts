import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-client-edit-view-disability',
  templateUrl: './client-edit-view-disability.component.html',
  styleUrls: ['./client-edit-view-disability.component.scss'],
})
export class ClientEditViewDisabilityComponent implements OnInit {

  @Input() appInfoForm: FormGroup;
  rdoMaterials$ = this.lovFacade.materialslov$;
  materialsyeslov$ = this.lovFacade.materialsyeslov$;
  pronounList: any = []; 
  
  constructor(private formBuilder: FormBuilder,
    private readonly lovFacade : LovFacade) {
      this.appInfoForm = this.formBuilder.group({Material: [''],});
    }

  ngOnInit(): void {
    this.lovFacade.getMaterialLovs();
    this.lovFacade.getMaterialYesLovs();
    this.loadPronouns();
  }
  private loadPronouns(){
    this.rdoMaterials$.subscribe((data) => {
      this.pronounList = data;
    
      data.forEach((element) => {
          this.appInfoForm.addControl(element.lovCode, new FormControl(''));
       
      });
    });
   
   }
}
