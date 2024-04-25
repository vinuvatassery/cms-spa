/** Angular **/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
/** Internal Library **/
import {
  NavigationMenu,
  NavigationMenuFacade,
  UserManagementFacade,
  UserDefaultRoles,
  UserLevel,
} from '@cms/system-config/domain';
import { MenuBadge } from '../enums/menu-badge.enum';
import { ApprovalLimitPermissionCode } from '../enums/approval-limit-permission-code.enum';
import { PendingApprovalPaymentTypeCode } from '../enums/pending-approval-payment-type-code.enum';


@Component({
  selector: 'cms-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
})
export class SideNavigationComponent implements OnInit, OnDestroy {
  /** Public properties **/
  isProductivityMenuActivated = false;
  subMenuExpandStatus: boolean[] = [];
  menus$ = this.navigationMenuFacade.navigationMenu$;
  pcaReassignmentCount$ = this.navigationMenuFacade.pcaReassignmentCount$;
  //add menu badges on this variable
  menuBadges = [
    { key: 'TO_DO_ITEMS', value: 5 },
    { key: MenuBadge.directMessage, value: 0 },
    { key: MenuBadge.productivityTools, value: 0 },
    { key: MenuBadge.financialManagement, value: 0 },
    { key: MenuBadge.fundsAndPcas, value: 0 },
    { key: MenuBadge.pendingApprovals, value: 0 },
  ];
  userLevel = 0;

  paymentCount = 0;
  generalCount = 0;
  importedClaimCount = 0;
  hivVerificationCount = 0;

  pendingApprovalCount = 0;
  directMessageCount = 0;
  toDoItemsCount = 0;

  productivityToolsCount = 0;
  selected: any = {};
  menuSubscription!: Subscription;
  menuItems: NavigationMenu[] = [];
  permissionLevels:any[]=[];
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
    this.addMenuSubscription();
  }

  ngOnDestroy() {
    this.navigationMenuFacade.pcaReassignmentCount$.subscribe().unsubscribe();
    this.menuSubscription.unsubscribe();
  }

  /** Internal event methods **/
  onSubMenuClicked(index: number) {
    this.subMenuExpandStatus[index] = !(
      this.subMenuExpandStatus[index] ?? false
    );
  }

  getBadge(key: string) {
    return this.menuBadges.find((i) => i.key === key)?.value ?? 0;
  }

  isShowBadge(key: string) {
    return (this.menuBadges.find((i) => i.key === key)?.value ?? 0) > 0;
  }

  onMenuClick(menu: NavigationMenu, $event: any) {
    if (menu.subMenus.length > 0 && !menu.parentId) {
      $event ? $event.stopPropagation() : null;
    } else {
      this.clearActiveMenu();
      if (menu?.url) {
        if (menu?.target === '_blank') {
          window.open(menu?.url, '_blank');
        } else {
          this.router.navigate([menu?.url]);
        }
      }
      this.activateMenu(menu);
    }
  }

  private activateMenuBasedOnRouter() {
    const currentUrl = this.router.url;

    // Find the menu corresponding to the current URL
    const menuToActivate = this.findMenuByUrl(currentUrl);

    if (menuToActivate) {
      this.activateMenu(menuToActivate);
    }
  }

  private findMenuByUrl(url: string) {
    const foundMenu = this.findMenuRecursive(this.menuItems, url);
    return foundMenu;
  }

  private findMenuRecursive(
    menus: NavigationMenu[],
    url: string
  ): NavigationMenu | undefined {
    for (const menu of menus) {
      if (menu.url === url) {
        return menu; // Found the menu with the matching URL
      }

      if (menu.subMenus?.length) {
        const foundSubMenu = this.findMenuRecursive(menu.subMenus, url);
        if (foundSubMenu) {
          return foundSubMenu; // Found the menu in a submenu
        }
      }
    }

    return undefined; // Menu not found
  }

  private activateMenu(menu: NavigationMenu) {
    // Activate the main menu
    menu.isActive = true;

    // Activate the parent menus if it's a submenu
    let parentMenu = menu;
    while (parentMenu.parentId) {
      parentMenu = this.findMenuById(parentMenu.parentId) || parentMenu;
      parentMenu.isActive = true;
    }
  }
  private clearActiveMenu() {
    const activeMenus = this.menuItems.filter((menu) => menu.isActive === true);
    activeMenus.forEach((menu) => {
      menu.isActive = false;
      if (menu.subMenus.length > 0) {
        const submenu = menu.subMenus;
        submenu.forEach((submenu) => {
          submenu.isActive = false;
          if (submenu.subMenus.length > 0) {
            const submenus = submenu.subMenus;
            submenus.forEach((supSubmenus) => {
              supSubmenus.isActive = false;
            });
          }
        });
      }
    });
  }

  private findMenuById(menuId: string) {
    const foundMenu = this.findMenuByIdRecursive(this.menuItems, menuId);
    return foundMenu;
  }
  private addMenuSubscription() {
    this.menuSubscription = this.menus$.subscribe((menus) => {
      this.menuItems = menus;
      this.activateMenuBasedOnRouter();
    });
  }

  private findMenuByIdRecursive(
    menus: NavigationMenu[],
    menuId: string
  ): NavigationMenu | undefined {
    for (const menu of menus) {
      if (menu.menuId === menuId) {
        return menu; // Found the menu with the matching ID
      }

      if (menu.subMenus?.length) {
        const foundSubMenu = this.findMenuByIdRecursive(menu.subMenus, menuId);
        if (foundSubMenu) {
          return foundSubMenu; // Found the menu in a submenu
        }
      }
    }

    return undefined; // Menu not found
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
    this.getDirectMessageCount();
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

  private getDirectMessageCount(){
    //this.navigationMenuFacade.getDirectMessageCount();
    this.subscribeToDirectMessageCount();
  }
  subscribeToDirectMessageCount(){
    this.navigationMenuFacade.directMessageCountCount$.subscribe({
      next: (messageCount) => {
        if (messageCount) {
          this.directMessageCount = messageCount;
          this.setProductivityToolsCount();
          this.setBadgeValue(MenuBadge.directMessage, this.directMessageCount);
        }
      },
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
    this.loadPendingApprovalPaymentLevel();
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
    this.navigationMenuFacade.hivVerificationCount$.subscribe({
      next:(hivVerificationCount) =>{
        if(hivVerificationCount){
          this.hivVerificationCount = hivVerificationCount;
          this.setProductivityToolsCount();
        }
      }
    })
  }

  private setProductivityToolsCount() {
    this.pendingApprovalCount =
      this.paymentCount + this.generalCount + this.importedClaimCount;
    this.productivityToolsCount =
      this.pendingApprovalCount + this.directMessageCount + this.toDoItemsCount + this.hivVerificationCount;
    this.setBadgeValue(MenuBadge.pendingApprovals, this.pendingApprovalCount);
    this.setBadgeValue(MenuBadge.productivityTools, this.productivityToolsCount);
  }

  
  loadPendingApprovalPaymentLevel() {
    this.permissionLevels=[];
        let level = this.setPermissionLevel(ApprovalLimitPermissionCode.InsurancePremiumPermissionCode);
        this.addItemToArray(PendingApprovalPaymentTypeCode.InsurancePremium,level);       

        level = this.setPermissionLevel(ApprovalLimitPermissionCode.MedicalClaimPermissionCode);
        this.addItemToArray(PendingApprovalPaymentTypeCode.TpaClaim,level);

        level = this.setPermissionLevel(ApprovalLimitPermissionCode.PharmacyPermissionCode);
        this.addItemToArray(PendingApprovalPaymentTypeCode.PharmacyClaim,level);

        this.navigationMenuFacade.getPendingApprovalPaymentCount(
          this.permissionLevels
        );
  }
  
  addItemToArray(serviceTypeCode:string,level:number)
  {
    let object = {
      serviceTypeCode : serviceTypeCode,
      level : level
    };
    this.permissionLevels.push(object);
  }
  setPermissionLevel(ifPermission : any)
  {
    if(this.userManagementFacade.hasPermission([ifPermission]))
    {
      return UserLevel.Level1Value;
    }
    let maxApprovalAmount = this.userManagementFacade.getUserMaxApprovalAmount(ifPermission);
    if(maxApprovalAmount != undefined && maxApprovalAmount > 0)
    {
      return UserLevel.Level1Value;
    }
    else
    {
      return UserLevel.Level2Value;
    }
  }
}
