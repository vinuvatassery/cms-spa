import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WidgetFacade } from '@cms/dashboard/domain';
import {CaseScreenTab, CaseStatusCode, ModuleCode} from '@cms/case-management/domain';
@Component({
  selector: 'dashboard-widget-applications-cers',
  templateUrl: './widget-applications-cers.component.html',
  styleUrls: ['./widget-applications-cers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetApplicationsCersComponent {
  applicationCERStats:any; 
  @Input() isEditDashboard!: any; 
  @Output() removeWidget = new EventEmitter<string>();
  constructor(private widgetFacade: WidgetFacade ,    private readonly router: Router ,private readonly activatedRoute : ActivatedRoute,
    private readonly cd: ChangeDetectorRef ) {
      this.applicationCERStats = new Array();
    }
  removeWidgetCard(){
    this.removeWidget.emit();
  }

  ngOnInit(): void { 
    
    this.loadApplicationCERStats();
  }

  loadApplicationCERStats() {
    this.widgetFacade.loadApplicationCERStats("e2301551-610c-43bf-b7c9-9b623ed425c3");
    this.widgetFacade.applicationCERStats$ 
      .subscribe({
        next: (response) => { 
          if (response.length == undefined) {
            this.applicationCERStats = response.applicationCERStats; 
            this.cd.detectChanges(); 
          }
        }
      });
  }
  todoitemsNavigate()
  {
    this.router.navigate([`/productivity-tools/todo-items`]);
  } 
  myClientsNavigate()
  {
    const query = {
      queryParams: {
        tab: CaseScreenTab.MY_CASES,
        casestatus: CaseStatusCode.incomplete
      },
    };
    this.router.navigate(['/case-management/cases'], query) 
  }
}
