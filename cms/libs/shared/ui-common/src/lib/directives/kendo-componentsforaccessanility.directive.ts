import { Directive, ElementRef, Renderer2, AfterViewInit, Input, HostListener } from '@angular/core';


// Create for accessability fixes for arial label
@Directive({
  selector: 'kendo-fileselect'
})
export class kendoFileSelectDirective {

  constructor(public renderer: Renderer2, public hostElement: ElementRef) { }
  ngOnInit() {
    const ariaLabel = this.hostElement.nativeElement.getAttribute('aria-label');
    const inputElement = this.hostElement.nativeElement.children[0].children[0].children[0];
    this.renderer.setAttribute(inputElement, 'aria-label', ariaLabel);
  }
}

// Create for accessability fixes for arial label
@Directive({
  selector: 'kendo-upload'
})
export class KendoFileUploadDirective {
  constructor(public renderer: Renderer2, public hostElement: ElementRef) { }
  ngOnInit() {
    const ariaLabel = this.hostElement.nativeElement.getAttribute('aria-label');
    const inputElement = this.hostElement.nativeElement.children[0].children[0].children[0];
    this.renderer.setAttribute(inputElement, 'aria-label', ariaLabel);
  }
}

// Create for accessability fixes for auto focusing the multicolumn combo box , autocomplete

@Directive({
  selector: '[autofocusfield]'
})
export class FormFieldAutoFocus implements AfterViewInit {
  constructor(public elementRef: ElementRef) { }
  ngAfterViewInit() {
    setTimeout(() => {                           // <<<---using ()=> syntax
      this.elementRef.nativeElement.children[0].children[0].focus();
    }, 200);
  }
}
// Create for accessability fixes for auto focusing the textboxes 


@Directive({
  selector: '[textFieldautofocus]'
})
export class TextFieldFormFieldAutoFocus implements AfterViewInit {

  constructor(public elementRef: ElementRef) { }

  ngAfterViewInit() {
    setTimeout(() => {                           // <<<---using ()=> syntax
      this.elementRef.nativeElement.children[1].focus();
    }, 300);
  }
}
// Create for accessability fixes for auto focusing the dropdown 

@Directive({
  selector: '[dropdownFieldautofocus]'
})
export class DropDownFieldFormFieldAutoFocus implements AfterViewInit {

  constructor(public elementRef: ElementRef) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.elementRef.nativeElement.focus();
    }, 300);
  }
}


@Directive({
  selector: '[numberOnly]'
})
export class NumberOnlyDirective {
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];
  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (
      this.specialKeys.indexOf(e.key) > -1 ||
      (e.key === 'a' && e.ctrlKey === true) || // Allow: Ctrl+A
      (e.key === 'c' && e.ctrlKey === true) || // Allow: Ctrl+C
      (e.key === 'v' && e.ctrlKey === true) || // Allow: Ctrl+V
      (e.key === 'x' && e.ctrlKey === true) || // Allow: Ctrl+X
      (e.key === 'a' && e.metaKey === true) || // Cmd+A (Mac)
      (e.key === 'c' && e.metaKey === true) || // Cmd+C (Mac)
      (e.key === 'v' && e.metaKey === true) || // Cmd+V (Mac)
      (e.key === 'x' && e.metaKey === true) // Cmd+X (Mac)
    ) {
      return;
    }
    if (e.key === ' ' || isNaN(Number(e.key))) {
      e.preventDefault();
    }
  }
}

