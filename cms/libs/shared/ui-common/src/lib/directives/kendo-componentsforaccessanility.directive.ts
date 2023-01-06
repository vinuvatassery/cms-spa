import { Directive, ElementRef, Renderer2, AfterViewInit } from '@angular/core';


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
  }}

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
  }}

// Create for accessability fixes for auto focusing the multicolumn combo box , autocomplete

@Directive({
  selector:'[autofocusfield]'
})
export class FormFieldAutoFocus implements AfterViewInit{ 
  constructor(public elementRef: ElementRef){} 
  ngAfterViewInit(){
    debugger;
    setTimeout(()=>{                           // <<<---using ()=> syntax
      this.elementRef.nativeElement.children[0].children[0].focus();
  }, 200); 
  }
}
// Create for accessability fixes for auto focusing the textboxes 


@Directive({
  selector:'[textFieldautofocus]'
})
export class TextFieldFormFieldAutoFocus implements AfterViewInit{

  constructor(public elementRef: ElementRef){}

  ngAfterViewInit(){
    setTimeout(()=>{                           // <<<---using ()=> syntax
      this.elementRef.nativeElement.children[1].focus();
  }, 300); 
  }
}
// Create for accessability fixes for auto focusing the dropdown 

@Directive({
  selector:'[dropdownFieldautofocus]'
})
export class DropDownFieldFormFieldAutoFocus implements AfterViewInit{

  constructor(public elementRef: ElementRef){}

  ngAfterViewInit(){ 
    setTimeout(()=>{
      this.elementRef.nativeElement.focus(); 
  }, 300); 
  }
}


