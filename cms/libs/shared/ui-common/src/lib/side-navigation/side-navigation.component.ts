/** Angular **/
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
/** Internal Library **/
import {
  NavigationMenu,
  NavigationMenuFacade,
  UserManagementFacade,
  UserDefaultRoles,
  UserLevel,
} from '@cms/system-config/domain';
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
    { key: 'TO_DO_ITEMS', value: 5 },
    { key: 'DIRECT_MESSAGES', value: 10 },
    { key: MenuBadge.productivityTools, value: 0 },
    { key: MenuBadge.financialManagement, value: 0 },
    { key: MenuBadge.fundsAndPcas, value: 0 },
    { key: MenuBadge.pendingApprovals, value: 0 },
  ];
  userLevel = 0;

  paymentCount = 0;
  generalCount = 0;
  importedClaimCount = 0;

  pendingApprovalCount = 0;
  directMessageCount = 0;
  toDoItemsCount = 0;

  productivityToolsCount = 0;
  selected: any = {};

  /** Constructor **/
  constructor(
    private readonly router: Router,
    private readonly navigationMenuFacade: NavigationMenuFacade,
    private userManagementFacade: UserManagementFacade
  ) {}

  /** Lifecycle events **/
  ngOnInit(): void {
    this.navigationMenuFacade.getNavigationMenu();
    this.getUserRole();
    this.getMenuCount();
     // Subscribe to NavigationEnd event
    
        const currentRoute = this.router.url.split('/')[1]; // Adjust the logic based on your routing structure
        this.setActive(currentRoute);
    
  }

  ngOnDestroy() {
    this.navigationMenuFacade.pcaReassignmentCount$.subscribe().unsubscribe();
  }

  /** Internal event methods **/
  onSubMenuClicked(index: number) {
    this.subMenuExpandStatus[index] = !(
      this.subMenuExpandStatus[index] ?? false
    );
  }
  setActive(item: string) {
    this.selected['main'] = item;
    // Add logic for setting the active state for sub-menu items if needed
  }
  getBadge(key: string) {
    return this.menuBadges.find((i) => i.key === key)?.value ?? 0;
  }

  isShowBadge(key: string) {
    return (this.menuBadges.find((i) => i.key === key)?.value ?? 0) > 0;
  }

  onMenuClick(type: any, menu: any, item: any, $event: any, mainMenuName: any) {
    if (type === 'main') {
      // For Main Menu Click
      this.selected['main'] = this.selected['main'] === item ? null : item;
      this.selected['sub'] = null; // Reset sub-menu selection
    } else if (type === 'sub') {
      // For Sub-Menu Click
      this.selected['sub'] = this.selected['sub'] === item ? null : item;
    }

    // Highlight the parent navigation for sub-menu click
    if (type === 'sub' && menu.parentId && mainMenuName) {
      this.selected['main'] = mainMenuName;
    }

    if (menu?.url) {
      if (menu?.target === '_blank') {
        window.open(menu?.url, '_blank');
      } else {
        this.router.navigate([menu?.url]);
      }
    }
  }
  isActive(type: any, item: any) {
    return this.selected[type] === item;
  }
  isMenuHeadingVisible = (menus: NavigationMenu[], filterText: string) =>
    menus?.findIndex(
      (menu: any) =>
        menu.name?.toLowerCase()?.indexOf(filterText?.toLowerCase()) !== -1
    ) !== -1;

  /** Private Methods */

  private getMenuCount() {
    this.getPcaAssignmentMenuCount();
    this.getPendingApprovalMenuCount();
  }

  private getPcaAssignmentMenuCount() {
    this.navigationMenuFacade.pcaReassignmentCount();
    this.subscribeToReassignPcaCount();
  }

  private setBadgeValue(key: string, value: number) {
    let menuIndex = this.menuBadges.findIndex((x) => x.key == key);
    (this.menuBadges[menuIndex] ?? null).value = value;
  }

  private subscribeToReassignPcaCount() {
    this.navigationMenuFacade.pcaReassignmentCount$.subscribe((count) => {
      this.setBadgeValue(MenuBadge.financialManagement, count);
      this.setBadgeValue(MenuBadge.fundsAndPcas, count);
    });
  }

  getUserRole() {
    if (
      this.userManagementFacade.hasRole(UserDefaultRoles.FinancialManagerL2)
    ) {
      this.userLevel = UserLevel.Level2Value;
    } else if (
      this.userManagementFacade.hasRole(UserDefaultRoles.FinancialManagerL1)
    ) {
      this.userLevel = UserLevel.Level1Value;
    }
  }

  private getPendingApprovalMenuCount() {
    this.navigationMenuFacade.getPendingApprovalPaymentCount(this.userLevel);
    this.navigationMenuFacade.getPendingApprovalGeneralCount();
    this.navigationMenuFacade.getPendingApprovalImportedClaimCount();
    this.subscribeToPendingApprovalCount();
  }

  private subscribeToPendingApprovalCount() {
    this.navigationMenuFacade.pendingApprovalPaymentCount$.subscribe({
      next: (paymentCount) => {
        if (paymentCount) {
          this.paymentCount = paymentCount;
          this.setProductivityToolsCount();
        }
      },
    });
    this.navigationMenuFacade.pendingApprovalGeneralCount$.subscribe({
      next: (generalCount) => {
        if (generalCount) {
          this.generalCount = generalCount;
          this.setProductivityToolsCount();
        }
      },
    });
    this.navigationMenuFacade.pendingApprovalImportedClaimCount$.subscribe({
      next: (importedClaimCount) => {
        if (importedClaimCount) {
          this.importedClaimCount = importedClaimCount;
          this.setProductivityToolsCount();
        }
      },
    });
  }

  private setProductivityToolsCount() {
    this.pendingApprovalCount =
      this.paymentCount + this.generalCount + this.importedClaimCount;
    this.productivityToolsCount =
      this.pendingApprovalCount + this.directMessageCount + this.toDoItemsCount;
    this.setBadgeValue(MenuBadge.pendingApprovals, this.pendingApprovalCount);
    this.setBadgeValue(
      MenuBadge.productivityTools,
      this.productivityToolsCount
    );
  }
}
