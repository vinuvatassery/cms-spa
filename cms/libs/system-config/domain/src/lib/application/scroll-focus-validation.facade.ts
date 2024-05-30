import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollFocusValidationfacade {
  invalidControl: any = null;
  /** Public methods **/
  findInvalidControl(form: any, nativeElement: any, controlFlag: any): any {
    this.invalidControl = controlFlag;
    this.traverseFormControls(form.controls, nativeElement);
    return this.invalidControl;
  }
  
  private traverseFormControls(formControls: any, nativeElement: any): void {
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName) && this.invalidControl == null) {
        const control = formControls[controlName];
        if (control.controls) {
          this.handleNestedControls(control, nativeElement);
        } else {
          this.checkControlValidity(control, controlName, nativeElement);
        }
      } else if (this.invalidControl != null) {
        break;
      }
    }
  }
  
  private handleNestedControls(control: any, nativeElement: any): void {
    if (Array.isArray(control.controls)) {
      this.traverseFormControls(control.controls[0], nativeElement);
    } else {
      this.traverseFormControls(control.controls, nativeElement);
    }
  }
  
  private checkControlValidity(control: any, controlName: string, nativeElement: any): void {
    if (control.invalid) {
      this.invalidControl = this.findInvalidElement(nativeElement, controlName);
    }
  }
  
  private findInvalidElement(nativeElement: any, controlName: string): any {
    let invalidElement = nativeElement.querySelector(`[formcontrolname="${controlName}"]`);
    if (invalidElement == null) {
      invalidElement = nativeElement.querySelector(`[id="${controlName}"]`);
    }
    return invalidElement;
  }
  
}
