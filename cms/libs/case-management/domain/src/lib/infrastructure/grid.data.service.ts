import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationProvider } from "@cms/shared/util-core";
import { GridState } from "../entities/grid-state"

@Injectable({ providedIn: 'root' })
export class GridDataService {
  constructor(private readonly http: HttpClient, private readonly configurationProvider: ConfigurationProvider) {

  }


  loadGridState(userId:any,gridStateKey:string,moduleCode:string) {
    return this.http.get<GridState>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/grids/state?userId=${userId}&gridStateKey=${gridStateKey}&moduleCode=${moduleCode}`);
  }
  createGridState(GridState: GridState) {
    return this.http.post<GridState>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/grids/state`,
      GridState,

    )
  }
}