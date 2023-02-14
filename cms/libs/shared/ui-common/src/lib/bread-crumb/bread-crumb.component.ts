/** Angular **/
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
/** External libraries **/
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { filter, Subscription, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'common-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadCrumbComponent implements OnInit {
  private routesData!: Subscription;
  private readonly breadcrumbsSubject = new BehaviorSubject<any[]>([]);
  readonly breadcrumbs$ = this.breadcrumbsSubject.asObservable();
  items: BreadCrumbItem[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.initRoutes();
  }

  ngOnInit(): void { }

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
      const routePath = child?.snapshot?.url[0]?.path;
      let isInValidRoutePath = routePath === null || routePath === undefined || routePath === '';
      if (isInValidRoutePath) {
        return this.createBreadcrumbs(child, url, breadcrumbs);
      }

      let isValidTitleExist = label !== null && label !== undefined;
      if ((isValidTitleExist) || !isInValidRoutePath) {

        breadcrumbs.push({
          text: isValidTitleExist ? label : this.formatText(routePath),
          title: url.replace('#', ''),
        });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
