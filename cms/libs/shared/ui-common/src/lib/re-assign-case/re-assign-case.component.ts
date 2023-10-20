/** Angular **/
import { Input, Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'common-re-assign-case',
  templateUrl: './re-assign-case.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReAssignCaseComponent {
  @Input() caseReassignForm: FormGroup;
  
  public formUiStyle: UIFormStyle = new UIFormStyle();

  constructor(
    private readonly formBuilder: FormBuilder,
    // private readonly cdr: ChangeDetectorRef,
    // private lovFacade: LovFacade,
    // public readonly intl: IntlService,
    // private readonly configurationProvider: ConfigurationProvider,
    // private readonly loaderService: LoaderService,
 ) {
    this.caseReassignForm = this.formBuilder.group({});
  }
}
