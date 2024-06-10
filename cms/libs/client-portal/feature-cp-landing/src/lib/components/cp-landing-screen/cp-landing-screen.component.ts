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
  selectProvider: any = [
    'One', 'Two' 
  ];

  showFirstDiv: boolean = true;
  showSecondDiv: boolean = false;
  showThirdDiv: boolean = false;

  toggleDivs() {
    this.showFirstDiv = !this.showFirstDiv;
    this.showSecondDiv = !this.showSecondDiv;
  }

  showPremiumPayments() {
    this.showFirstDiv = false;
    this.showSecondDiv = false;
    this.showThirdDiv = true;
  }

  

  
  public items: BreadCrumbItem[] = [...defaultItems];
  
}


