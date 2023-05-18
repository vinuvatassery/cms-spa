/** Angular **/
import { OnInit, Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseFacade, ClientProfile, StatusPeriodFacade } from '@cms/case-management/domain';
import { first, Subject } from 'rxjs';
import { SnackBarNotificationType } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-profile-client-page',
  templateUrl: './profile-client-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileClientPageComponent implements OnInit {

  profileClientId!: number;
  clientCaseEligibilityId!: any;
  clientCaseId!: any;
  tabId! : any
  private clientSubject = new Subject<any>();
  clientProfile$ = this.caseFacade.clientProfile$;
  loadedClient$ = this.clientSubject.asObservable();
  ramSellInfo!: any;
  constructor(
    private readonly caseFacade: CaseFacade,
    private route: ActivatedRoute,
    private statusPeriodFacade: StatusPeriodFacade
  ) { }
  
  ngOnInit(): void {
    this.loadQueryParams()  
  }

  /** Private properties **/
  loadQueryParams()
  {
    this.profileClientId = this.route.snapshot.queryParams['id'];
    this.clientCaseEligibilityId = this.route.snapshot.queryParams['e_id'];   
    this.tabId = this.route.snapshot.queryParams['tid'];
    this.clientCaseId =this.route.snapshot.queryParams['cid'];
    this.loadReadOnlyClientInfoEventHandler()
  }

  loadReadOnlyClientInfoEventHandler() {
    this.caseFacade.loadClientProfile(this.clientCaseEligibilityId);   

    this.onClientProfileLoad()
  }

  onClientProfileLoad() {
    this.clientProfile$?.pipe(first((clientData: any) => clientData?.clientId > 0))
      .subscribe((clientData: ClientProfile) => {
        if (clientData?.clientId > 0) {

          const client = {

            clientId: clientData?.clientId,
            firstName: clientData?.firstName,
            middleName: clientData?.middleName,
            lastName: clientData?.lastName,
            caseManagerId: clientData?.caseManagerId,
            caseManagerName: clientData?.caseManagerName,
            caseManagerPNumber: clientData?.caseManagerPNumber,
            caseManagerDomainCode: clientData?.caseManagerDomainCode,
            caseManagerAssisterGroup: clientData?.caseManagerAssisterGroup,
            caseManagerPhone: clientData?.caseManagerPhone,
            caseManagerEmail: clientData?.caseManagerEmail,
            caseManagerFax: clientData?.caseManagerFax,
            caseManagerAddress1: clientData?.caseManagerAddress1,
            caseManagerAddress2: clientData?.caseManagerAddress2,
            caseManagerCity: clientData?.caseManagerCity,
            caseManagerState: clientData?.caseManagerState,
            caseManagerZip: clientData?.caseManagerZip,
            insuranceFirstName: clientData?.insuranceFirstName,
            insuranceLastName: clientData?.insuranceLastName,
            officialIdFirstName: clientData?.officialIdFirstName,
            officialIdLastName: clientData?.officialIdLastName,
            dob: clientData?.dob,
            pronouns: clientData?.pronouns,
            genderDescription: clientData?.genderDescription,
            gender: clientData?.gender,
            ssn: clientData?.ssn,
            clientTransgenderCode: clientData?.clientTransgenderCode,
            clientTransgenderDesc: clientData?.clientTransgenderDesc,
            clientSexualIdentities: clientData?.clientSexualIdentities,
            otherSexualDesc: clientData?.otherSexualDesc,
            sexAtBirth: clientData?.sexAtBirth,
            spokenLanguage: clientData?.spokenLanguage,
            writtenLanguage: clientData?.writtenLanguage,
            englishProficiency: clientData?.englishProficiency,
            ethnicIdentity: clientData?.ethnicIdentity,
            racialIdentities: clientData?.racialIdentities,
            primaryRacialIdentity: clientData?.primaryRacialIdentity,
            lastModificationTime: clientData?.lastModificationTime,
            lastModifierName: clientData?.lastModifierName,
            lastModifierId: clientData?.lastModifierId
          }
          this.loadRamSellInfo(client.clientId);
          this.clientSubject.next(client);

        }
      });

  }

  loadRamSellInfo(clientId: any) {
    this.statusPeriodFacade.showLoader();
    this.statusPeriodFacade.loadRamSellInfo(clientId).subscribe({
      next: (data) => {
        this.ramSellInfo = data;
        this.statusPeriodFacade.hideLoader();
      },
      error: (err) => {
        this.statusPeriodFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

}
