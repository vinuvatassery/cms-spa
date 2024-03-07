import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollFocusValidationfacade {
  invalidControl: any = null;
  /** Public methods **/
  findInvalidControl(form: any, nativeElement: any,controlFlag:any): any {
    this.invalidControl=controlFlag;
    const formControls = form.controls;
    for (const controlName in formControls) {
      if (formControls?.hasOwnProperty(controlName) && this.invalidControl == null) {
        const control = formControls[controlName];
        if (control.controls) {
          if(Array.isArray(control.controls)){
            this.findInvalidControl(control.controls[0], nativeElement,null);
          }else{
            this.findInvalidControl(control, nativeElement,null);
          }
        } else {
          if (control.invalid) {
            this.invalidControl = nativeElement.querySelector(`[formcontrolname="${controlName}"]`);
            if (this.invalidControl == null) {
              this.invalidControl = nativeElement.querySelector(`[id="${controlName}"]`);
              if (this.invalidControl == null) {
                continue;
              }
            }
            return this.invalidControl;
          }
        }
      }else{
        return this.invalidControl;
      }
    }
    return this.invalidControl;
  }
}
