/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
/** External libraries **/
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { filter, Subscription, BehaviorSubject } from 'rxjs';
import { shapeLineIcon, SVGIcon } from "@progress/kendo-svg-icons";
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

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.initRoutes();
  }

  ngOnDestroy(): void {
    this.routesData.unsubscribe();
  }

  private initRoutes(): void {
    this.routesData = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((d) => {
        this.items = this.createBreadcrumbs(this.activatedRoute.root);
        this.items = [
          {
            text: 'Home',
            title: 'dashboard',
          },
          ...this.items,
        ];
        this.breadcrumbsSubject.next(this.items);
      });
  }

  onItemClick(item: BreadCrumbItem): void {
    const selectedItemIndex = this.items.findIndex((i) => i.text === item.text);
    const url = this.items
      .slice(selectedItemIndex, selectedItemIndex + 1)
      .map((i: any) => i.title.toLowerCase());
    console.log(url, selectedItemIndex);

    this.router.navigate(url, { queryParamsHandling: "preserve" });
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
}
