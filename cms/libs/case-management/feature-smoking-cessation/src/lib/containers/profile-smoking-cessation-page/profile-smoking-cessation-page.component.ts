/** Angular **/
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScreenType } from '@cms/case-management/domain';


@Component({
  selector: 'case-management-profile-smoking-cessation-page',
  templateUrl: './profile-smoking-cessation-page.component.html',
  styleUrls: ['./profile-smoking-cessation-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSmokingCessationPageComponent implements OnInit {

 
  screenName = ScreenType.Case360Page; 
 
  historyClientCaseEligibilityId!: string;
  clientCaseId!: string;
  clientId!: number;
  clientCaseEligibilityId!: any; 
  tabId! : any

    /** Constructor**/
    constructor(
      private route: ActivatedRoute
    ) {
    }
 /** Lifecycle hooks **/
 ngOnInit() {
   
  this.loadQueryParams()

}

loadQueryParams()
{
  this.clientId = this.route.snapshot.queryParams['id'];
  this.clientCaseEligibilityId = this.route.snapshot.queryParams['e_id'];    
  this.tabId = this.route.snapshot.queryParams['tid'];  
  this.clientCaseId = this.route.snapshot.queryParams['cid'];  
 
 
}
 
}
