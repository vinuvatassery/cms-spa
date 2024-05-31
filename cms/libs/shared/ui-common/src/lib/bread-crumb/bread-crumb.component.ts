/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
/** External libraries **/
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { filter, Subscription, BehaviorSubject } from 'rxjs';
import { shapeLineIcon, SVGIcon } from "@progress/kendo-svg-icons";
import { NavigationMenu, NavigationMenuFacade } from '@cms/system-config/domain';
@Component({
  selector: 'common-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadCrumbComponent {
  public lIcon: SVGIcon = shapeLineIcon;
  private routesData!: Subscription;
  private readonly breadcrumbsSubject = new BehaviorSubject<any[]>([]);
  readonly breadcrumbs$ = this.breadcrumbsSubject.asObservable();
  items: BreadCrumbItem[] = [];
  menus$ = this.navigationMenuFacade.navigationMenu$;
  constructor(private router: Router, private activatedRoute: ActivatedRoute,
    private readonly navigationMenuFacade: NavigationMenuFacade,
  ) {
    this.initRoutes();
  }

  ngOnDestroy(): void {
    this.routesData.unsubscribe();
  }

  private initRoutes(): void {
    this.routesData = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((d) => {
        this.menus$.subscribe((menus) => {
          const breadcrumbList = this.newCreateBreadcrumbs(menus, this.router.url);
          if (breadcrumbList != null && breadcrumbList.length > 0) {
            console.log("breadcrumbList", breadcrumbList);
            this.items = [
              {
                text: 'Home',
                title: 'dashboard',
              },
              ...breadcrumbList,
            ];
            this.breadcrumbsSubject.next(this.items);
          }

        });
      });
  }

  onItemClick(item: BreadCrumbItem): void {
    this.menus$.subscribe((menus) => {
        if (this.items.length > 0) {
            const selectedMenu = this.getSelectedMenu(menus, item);
            const returnUrl = selectedMenu ? this.findFirstMenuItemUrl(selectedMenu.subMenus) : undefined;
            this.navigateToUrl(returnUrl);
        } else {
          this.router.navigate(["/dashboard"], { queryParamsHandling: "preserve" });
        }
    });
}

private getSelectedMenu(menus: any[], item: BreadCrumbItem) {
    const menuIndex = menus.findIndex((i) => i.name === this.items[1].text);
    if (menuIndex > -1) {
        if (this.items[1].text === item.text) {
            return menus[menuIndex];
        } else {
            const parentId = menus[menuIndex].menuId;
            return this.findMenuUrlByName(menus[menuIndex].subMenus, item, parentId);
        }
    }
    return undefined;
}

private navigateToUrl(returnUrl?: string) {
    if (returnUrl != undefined) {
        this.router.navigate([returnUrl]);
    } else {
        this.router.navigate(["/dashboard"], { queryParamsHandling: "preserve" });
    }
}


  /**
  * Searches for a NavigationMenu item by selected breadCrumbItem name within a nested hierarchy.
  * 
  * @param {NavigationMenu[]} menus - An array of NavigationMenu items to search within.
  * @param {BreadCrumbItem} item - The BreadCrumbItem to find within the menus.
  * @param {string} parentId - The parent ID to match when searching for the menu item.
  * @returns {NavigationMenu | undefined} - The first found NavigationMenu item matching the name and parent ID, or undefined if not found.
  */

  private findMenuUrlByName(menus: NavigationMenu[], item: BreadCrumbItem, parentId: string): any {
    for (const menu of menus) {
      if (menu.name.includes(item.text ?? '') && menu.parentId === parentId) {
        return menu;
      }
      if (menu.subMenus.length > 0) {
        const foundInSubMenu: NavigationMenu | undefined = this.findMenuUrlByName(menu.subMenus, item, parentId);
        if (foundInSubMenu) {
          return foundInSubMenu;
        }
      }
    }
    return undefined;
  }

  /**
  * Function to find the first NavigationMenu item with a non-empty URL.
  *
  * @param {NavigationMenu[]} menus - An array of NavigationMenu items to search.
  * @returns {string | undefined} - The URL of the first found menu item with a non-empty URL, or undefined if no such item is found.
  */

  private findFirstMenuItemUrl(menus: NavigationMenu[]): any {
    for (const menu of menus) {
      if (menu.url && menu.url !== undefined && menu.url !== '') {
        return menu.url;
      }
      const foundUrlInSubMenu: string | undefined = this.findFirstMenuItemUrl(menu.subMenus);
      if (foundUrlInSubMenu) {
        return foundUrlInSubMenu;
      }
    }
    return undefined;
  }

  private formatText(routeText: string): any {
    let formattedText = '';
    routeText.split('-').forEach(
      (i: any) => formattedText += (formattedText.length > 0 ? ' ' : '') + i.charAt(0).toUpperCase() + i.slice(1)
    );
    return formattedText;
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '#', breadcrumbs: BreadCrumbItem[] = []): BreadCrumbItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data['title'];
      const routePath = label !== '' ? child?.snapshot?.url[0]?.path : '';
      let isInValidRoutePath = routePath === null || routePath === undefined || routePath === '';
      if (isInValidRoutePath) {
        return this.createBreadcrumbs(child, url, breadcrumbs);
      }

      this.addBreadcrumb(breadcrumbs, label, isInValidRoutePath, routePath, url);
      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  private addBreadcrumb(breadcrumbs: BreadCrumbItem[], label: string, isInValidRoutePath: boolean, routePath: string, url: string) {
    let isValidTitleExist = label !== null && label !== undefined && label !== '';
    if ((isValidTitleExist) || !isInValidRoutePath) {

      const breadcrumbText = isValidTitleExist ? label : this.formatText(routePath);
      breadcrumbs.push({
        text: breadcrumbText,
        title: url.replace('#', ''),
      });
    }
  }


 /**
 * Creates a breadcrumb trail for a given URL by searching through a navigation menu list.
 * 
 * @param menuList - An array of navigation menu items to search through.
 * @param urlToFind - The URL to find within the navigation menu.
 * @returns An array of BreadCrumbItems representing the hierarchy of the found item, or null if not found.
 */
  private newCreateBreadcrumbs(menuList: NavigationMenu[], urlToFind: string): BreadCrumbItem[] | null {


    for (const menu of menuList) {
      const hierarchy = this.findItemRecursively([menu], urlToFind, []);
      if (hierarchy) {
        return hierarchy;
      }
    }

    return null;
  }

  /**
  * Recursively finds a menu item by URL and constructs its breadcrumb hierarchy.
  * 
  * @param menus - An array of navigation menu items to search through.
  * @param url - The URL to find within the navigation menus.
  * @param hierarchy - The current hierarchy of breadcrumb items being constructed.
  * @returns An array of BreadCrumbItems representing the hierarchy of the found item, or null if not found.
  */

  private findItemRecursively(menus: NavigationMenu[], url: string, hierarchy: BreadCrumbItem[]): BreadCrumbItem[] | null {
    for (const menu of menus) {
      if (menu.url === url) {
        hierarchy.push({ text: menu.name, title: `/${menu.name.toLowerCase().replace(/ /g, "-")}`});
        return hierarchy;
      }
      if (menu.subMenus.length > 0) {
        const foundInSubMenu = this.findItemRecursively(menu.subMenus, url, [...hierarchy, { text: menu.name, title: `/${menu.name.toLowerCase().replace(/ /g, "-")}`}]);
        if (foundInSubMenu) {
          return foundInSubMenu;
        }
      }
    }
    return null;
  }



}
