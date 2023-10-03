/** Angular **/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
/** Internal Library **/
import { NavigationMenu, NavigationMenuFacade, UserManagementFacade } from '@cms/system-config/domain';
import { MenuBadge } from '../enums/menu-badge.enum';

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
  pcaReassignmentCount$ = this.navigationMenuFacade.pcaReassignmentCount$;
  //add menu badges on this variable
  menuBadges = [
    { key: "PRODUCTIVITY_TOOLS", value: 17 },
    { key: "PENDING_APPROVALS", value: 2 },
    { key: "TO_DO_ITEMS", value: 5 },
    { key: "DIRECT_MESSAGES", value: 10 },
    { key: MenuBadge.financialManagement, value: 0 },
    { key: MenuBadge.fundsAndPcas, value: 0 },
    {key : MenuBadge.pendingApprovals, value: 99}
  ];
  userLevel = 0;

  /** Constructor **/
  constructor(private readonly router: Router,
    private readonly navigationMenuFacade: NavigationMenuFacade,private userManagementFacade: UserManagementFacade) { }

  /** Lifecycle events **/
  ngOnInit(): void {
    this.getUserRole();
    this.navigationMenuFacade.getNavigationMenu();
    this.getMenuCount();    
  }

  ngOnDestroy(){
    this.navigationMenuFacade.pcaReassignmentCount$.subscribe().unsubscribe();
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
      this.getPendingApprovalCount();

    }
  
    private getPcaAssignmentMenuCount(){
      this.navigationMenuFacade.pcaReassignmentCount();
      this.subscribeToReassignPcaCount();
    }
  
    private setBadgeValue(key: string, value: number){
      let menuIndex = this.menuBadges.findIndex(x => x.key == key);
      (this.menuBadges[menuIndex]?? null).value = value;
    }
  
    private subscribeToReassignPcaCount(){
      this.navigationMenuFacade.pcaReassignmentCount$.subscribe((count) => {
        this.setBadgeValue(MenuBadge.financialManagement, count);
        this.setBadgeValue(MenuBadge.fundsAndPcas, count);    
      });    
    }
  
    getUserRole(){
      if(this.userManagementFacade.hasRole("FM1")){
        this.userLevel = 1;
        return;
      }
      if(this.userManagementFacade.hasRole("FM2")){
        this.userLevel = 2;
      }
    }

    private subscribeToPendingApprovalCount(){
      this.navigationMenuFacade.pendingApprovalCount$.subscribe({
        next: (val)=>{
        this.setBadgeValue(MenuBadge.pendingApprovals, val);
        }
      })
    }

    private getPendingApprovalCount(){
      this.navigationMenuFacade.getAllPendingApprovalPaymentCount(this.userLevel);
      this.subscribeToPendingApprovalCount();
    }
  
}
