/** Angular **/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
/** Internal Library **/
import { NavigationMenu, NavigationMenuFacade, UserManagementFacade, UserDefaultRoles, UserLevel } from '@cms/system-config/domain';
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
    {key : MenuBadge.pendingApprovals, value: 0}
  ];
  userLevel = 0;

  /** Constructor **/
  constructor(private readonly router: Router,
    private readonly navigationMenuFacade: NavigationMenuFacade,private userManagementFacade: UserManagementFacade) { }

  /** Lifecycle events **/
  ngOnInit(): void {
    this.navigationMenuFacade.getNavigationMenu();
    this.getUserRole();
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
      this.getPendingApprovalMenuCount();

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
      if(this.userManagementFacade.hasRole(UserDefaultRoles.FinancialManagerL2)){
        this.userLevel = UserLevel.Level2Value;
      }
      else if(this.userManagementFacade.hasRole(UserDefaultRoles.FinancialManagerL1)){
        this.userLevel = UserLevel.Level1Value;
      }
    }

    private getPendingApprovalMenuCount(){
      this.navigationMenuFacade.getPendingApprovalPaymentCount(this.userLevel);
      this.navigationMenuFacade.getPendingApprovalGeneralCount();
      this.navigationMenuFacade.getPendingApprovalImportedClaimCount();
      this.subscribeToPendingApprovalCount();
    }

    private subscribeToPendingApprovalCount(){
      this.navigationMenuFacade.pendingApprovalPaymentCount$.subscribe({
        next: (paymentCount)=>{
        this.navigationMenuFacade.pendingApprovalGeneralCount$.subscribe({
          next: (generalCount)=>{
            this.navigationMenuFacade.pendingApprovalImportedClaimCount$.subscribe({
              next: (importedClaimCount)=>{
                this.setBadgeValue(MenuBadge.pendingApprovals, 
                  paymentCount? 0 : paymentCount
                  + generalCount? 0 : generalCount 
                  + importedClaimCount? 0 : importedClaimCount);
              }
            });  
          }
        });
        }
      })
    }
}
