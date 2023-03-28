/** Angular **/
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'case-management-profile-health-insurance-page',
  templateUrl: './profile-health-insurance-page.component.html',
  styleUrls: ['./profile-health-insurance-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileHealthInsurancePageComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
  
  ) { }

  profileClientId!: number;
  clientCaseEligibilityId!: any;
  clientCaseId!: any;
  tabId! : any
  ngOnInit(): void {
    this. loadQueryParams()
   
  }

  /** Private properties **/
  loadQueryParams()
  {
    this.profileClientId = this.route.snapshot.queryParams['id'];
    this.clientCaseEligibilityId = this.route.snapshot.queryParams['elg_id'];
    this.clientCaseId = this.route.snapshot.queryParams['clientCaseId'];
    this.tabId = this.route.snapshot.queryParams['tabId'];  
  }
}



