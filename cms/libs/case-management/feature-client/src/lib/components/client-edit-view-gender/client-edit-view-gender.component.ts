import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LovDataService, LovType } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-client-edit-view-gender',
  templateUrl: './client-edit-view-gender.component.html',
  styleUrls: ['./client-edit-view-gender.component.scss'],
})
export class ClientEditViewGenderComponent implements OnInit {
  @Input() Form: FormGroup;
 // dynamicForm: FormGroup;
  GenderList: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private readonly lovDataService: LovDataService
  ) {
    this.Form = this.formBuilder.group({
      Gender: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.lovDataService.getLovsbyType(LovType.Gender).subscribe((data) => {
      this.GenderList = data;
      console.log(data);
      data.forEach((element) => {
        this.Form.addControl(element.lovCode, new FormControl(''));
      });
    });
  }
  get f() { return this.Form.controls; }

  onCheckChange(event:any) {
    console.log(event.target.checked)
   console.log(this.f) ;
  }
}
