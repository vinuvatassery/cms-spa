/** Angular **/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
/** Internal Library **/
import { NavigationMenu, NavigationMenuFacade } from '@cms/system-config/domain';
import {FinancialPcaFacade } from '@cms/case-management/domain';
import { MenuBagde } from '../enums/menu-badge.enum';

@Component({
  selector: 'cms-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
})
export class SideNavigationComponent implements OnInit {
  /** Public properties **/
  isProductivityMenuActivated = false;
  subMenuExpandStatus: boolean[] = [];
  menus$ = this.navigationMenuFacade.navigationMenu$;
  pcaReassignmentCount$ = this.financialPcaFacade.pcaReassignmentCount$;
  //add menu badges on this variable
  menuBadges = [
    { key: "PRODUCTIVITY_TOOLS", value: 17 },
    { key: "PENDING_APPROVALS", value: 2 },
    { key: "TO_DO_ITEMS", value: 5 },
    { key: "DIRECT_MESSAGES", value: 10 },
    { key: MenuBagde.financialManagement, value: 0 },
    { key: MenuBagde.fundsAndPcas, value: 0 },
  ];
  /** Constructor **/
  constructor(private readonly router: Router,
    private readonly navigationMenuFacade: NavigationMenuFacade,
    private readonly financialPcaFacade: FinancialPcaFacade) { }

  /** Lifecycle events **/
  ngOnInit(): void {
    this.navigationMenuFacade.getNavigationMenu();
    this.getMenuCount();    
  }

  /** Internal event methods **/
  onSubMenuClicked(index: number) {
    this.subMenuExpandStatus[index] = !(this.subMenuExpandStatus[index] ?? false);
  }

  getBadge(key: string) {
    return this.menuBadges.find(i => i.key === key)?.value ?? 0;
  }

  isShowBadge(key: string){
    return (this.menuBadges.find(i => i.key === key)?.value ?? 0) > 0 ;
  }

  onMenuClick(menu: any) {
    if (menu?.url) {
      if (menu?.target === '_blank') {
        window.open(menu?.url, '_blank');
      }
      else {
        this.router.navigate([menu?.url]);
      }
    }
  }

  isMenuHeadingVisible = (menus: NavigationMenu[], filterText: string) => menus?.findIndex((menu: any) =>
    menu.name?.toLowerCase()?.indexOf(filterText?.toLowerCase()) !== -1) !== -1;

    /** Private Methods */

    private getMenuCount(){
      this.getPcaAssignmentMenuCount();
    }
  
    private getPcaAssignmentMenuCount(){
      this.financialPcaFacade.pcaReassignmentCount();
      this.subscribeToReassignPcaCount();
    }
  
    private setBadgeValue(key: string, value: number){
      let menuIndex = this.menuBadges.findIndex(x => x.key == key);
      (this.menuBadges[menuIndex]?? null).value = value;
    }
  
    private subscribeToReassignPcaCount(){
      this.financialPcaFacade.pcaReassignmentCount$.subscribe((count) => {
        this.setBadgeValue(MenuBagde.financialManagement, count);
        this.setBadgeValue(MenuBagde.fundsAndPcas, count);    
      });    
    }
  
  
}
