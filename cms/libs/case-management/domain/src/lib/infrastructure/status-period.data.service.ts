/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class StatusPeriodDataService {

  private baseUrl = "/case-management";

  /** Constructor**/
  constructor(private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider) { }

  /** Public methods **/
  loadStatusPeriod() {
    return of([
      {
        id: 1,
        StatusStart: '02-22-2022',
        StatusEnd: '02-22-2022',
        Status: 'status A',
        CurrentGroup: 'Proof ',
        DaysinGroup: 'daysin',
        FamilySize: 5,
        GrossMonthlyIncome: '$ 23000',
        FPLSPStart: '244%',
        CurrentFPL: '253%',
        ReviewCompleted: '02-22-2022',
        By: 'James',
        RamseelInfo: {
          MostRecentTransfer: '02-22-2022 - 10:00 AM',
          CardRequested: "Beverages",
          DateCardLastSent: "02-22-2022",
        },
        GroupHistory: [
          {
            id: 2,
            Group: '02-22-2022 - 10:00 AM',
            StartDate: "02-22-2022",
            EndDate: "02-22-2022",
            ActualDaysinGroup: 149,
            DateRecordCreated: "02-22-2022",
            RecordCreatedBy: "Jan",
          },
          {
            id: 2,
            Group: '02-22-2022 - 10:00 AM',
            StartDate: "02-22-2022",
            EndDate: "02-22-2022",
            ActualDaysinGroup: 149,
            DateRecordCreated: "02-22-2022",
            RecordCreatedBy: "Jan",
          },
          {
            id: 3,
            Group: '02-22-2022 - 10:00 AM',
            StartDate: "02-22-2022",
            EndDate: "02-22-2022",
            ActualDaysinGroup: 149,
            DateRecordCreated: "02-22-2022",
            RecordCreatedBy: "Jan",
          },
        ],
        FlipHiwebwestory: [
          {
            id: 1,
            Flp: '253%',
            StartDate: "02-22-2022",
            EndDate: "02-22-2022",
            ActualDayswithFlp: 149,
            DateRecordCreated: "02-22-2022",
            RecordCreatedBy: "Jan",
          },
          {
            id: 2,
            Flp: '253%',
            StartDate: "02-22-2022",
            EndDate: "02-22-2022",
            ActualDayswithFlp: 149,
            DateRecordCreated: "02-22-2022",
            RecordCreatedBy: "Jan",
          },

        ],
      },
      {
        id: 2,
        StatusStart: '02-22-2022',
        StatusEnd: '02-22-2022',
        Status: 'status A',
        CurrentGroup: 'Proof ',
        DaysinGroup: 'daysin',
        FamilySize: 5,
        GrossMonthlyIncome: '$ 23000',
        FPLSPStart: '244%',
        CurrentFPL: '253%',
        ReviewCompleted: '02-22-2022',
        By: 'James',
        RamseelInfo: {
          MostRecentTransfer: '02-22-2022 - 10:00 AM',
          CardRequested: "Beverages",
          DateCardLastSent: "02-22-2022",
        },
        GroupHistory: [
          {
            id: 2,
            Group: '02-22-2022 - 10:00 AM',
            StartDate: "02-22-2022",
            EndDate: "02-22-2022",
            ActualDaysinGroup: 149,
            DateRecordCreated: "02-22-2022",
            RecordCreatedBy: "Jan",
          },
          {
            id: 2,
            Group: '02-22-2022 - 10:00 AM',
            StartDate: "02-22-2022",
            EndDate: "02-22-2022",
            ActualDaysinGroup: 149,
            DateRecordCreated: "02-22-2022",
            RecordCreatedBy: "Jan",
          },
          {
            id: 3,
            Group: '02-22-2022 - 10:00 AM',
            StartDate: "02-22-2022",
            EndDate: "02-22-2022",
            ActualDaysinGroup: 149,
            DateRecordCreated: "02-22-2022",
            RecordCreatedBy: "Jan",
          },
        ],

        FlipHistory: [
          {
            id: 1,
            Flp: '253%',
            StartDate: "02-22-2022",
            EndDate: "02-22-2022",
            ActualDayswithFlp: 149,
            DateRecordCreated: "02-22-2022",
            RecordCreatedBy: "Jan",
          },
          {
            id: 2,
            Flp: '253%',
            StartDate: "02-22-2022",
            EndDate: "02-22-2022",
            ActualDayswithFlp: 149,
            DateRecordCreated: "02-22-2022",
            RecordCreatedBy: "Jan",
          },

        ],
      },
    ]);
  }

  loadStatusGroupHistory(eligibilityId: string) {
    return this.http.get<any[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` + this.baseUrl +
      `/eligibility-periods/${eligibilityId}/group-history`
    );
  }

  loadStatusFplHistory(eligibilityId: string) {
    return this.http.get<any[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` + this.baseUrl +
      `/eligibility-periods/${eligibilityId}/fpl-history`
    );
  }

  loadRamSellInfo(clientId: string) {
    return this.http.get<any[]>(
      `${this.configurationProvider.appSettings.sysInterfaceApiUrl}` 
      + `/system-interface/ramsell/clients/${clientId}`
    );
  }
}
