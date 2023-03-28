/** Angular **/
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'case-management-profile-healthcare-provider-page',
  templateUrl: './profile-healthcare-provider-page.component.html',
  styleUrls: ['./profile-healthcare-provider-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileHealthcareProviderPageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
  
  ) { }
  
  profileClientId!: number;
  clientCaseEligibilityId!: any; 
  tabId! : any
  ngOnInit(): void {
    this. loadQueryParams()
   
  }

  /** Private properties **/
  loadQueryParams()
  {
    this.profileClientId = this.route.snapshot.queryParams['id'];
    this.clientCaseEligibilityId = this.route.snapshot.queryParams['elg_id'];    
    this.tabId = this.route.snapshot.queryParams['tabId'];  
  }
}
