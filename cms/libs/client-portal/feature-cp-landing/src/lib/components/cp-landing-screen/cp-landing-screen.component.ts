import { Component, HostListener } from '@angular/core';
import { BreadCrumbItem } from '@progress/kendo-angular-navigation';



const defaultItems: BreadCrumbItem[] = [
  {
    text: "Home",
    title: "Home",
  },
  {
    text: "CAREAssist",
    title: "CAREAssist",
  },

];


@Component({
  selector: 'cms-cp-landing-screen',
  templateUrl: './cp-landing-screen.component.html',
})



export class CpLandingScreenComponent {
  dropDowncolumns: any = [
    'English', 'Arabic' 
  ];

  showFirstDiv: boolean = true;
  toggleDivs() {
    this.showFirstDiv = !this.showFirstDiv;
  }

  

  
  public items: BreadCrumbItem[] = [...defaultItems];
  
}


