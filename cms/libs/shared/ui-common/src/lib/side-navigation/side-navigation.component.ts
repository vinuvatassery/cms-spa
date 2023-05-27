/** Angular **/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
/** Internal Library **/
import { NavigationMenu, NavigationMenuFacade } from '@cms/system-config/domain';
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
  searchText: string = '';
  //add menu badges on this variable
  menuBadges = [
    { key: "PRODUCTIVITY_TOOLS", value: 17 },
    { key: "PENDING_APPROVALS", value: 2 },
    { key: "TO_DO_ITEMS", value: 5 },
    { key: "DIRECT_MESSAGES", value: 10 }
  ];
  /** Constructor **/
  constructor(private readonly router: Router,
    private readonly navigationMenuFacade: NavigationMenuFacade) { }

  /** Lifecycle events **/
  ngOnInit(): void {
    this.navigationMenuFacade.getNavigationMenu();
  }

  /** Internal event methods **/
  onSubMenuClicked(index: number) {
    this.subMenuExpandStatus[index] = !(this.subMenuExpandStatus[index] ?? false);
  }

  getBadge(key: string) {
    return this.menuBadges.find(i => i.key === key)?.value ?? 0;
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

  isMenuHeadingVisible = (menus: NavigationMenu[]) => menus?.findIndex((menu: any) =>
    menu.name?.toLowerCase()?.indexOf(this.searchText?.toLowerCase()) !== -1) !== -1;

}
