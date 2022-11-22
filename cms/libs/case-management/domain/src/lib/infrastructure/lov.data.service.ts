/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** External libraries **/


/** Entities **/
import { Lov } from '../entities/lov';


/** Providers **/
import { ConfigurationProvider } from '@cms/shared/util-core';


@Injectable({ providedIn: 'root' })

export class LovDataService {
    /** Constructor**/
    constructor(private readonly http: HttpClient,
      private configurationProvider : ConfigurationProvider) {}


      getLovsbyType(lovType : string) {
        
        return this.http.get<Lov[]>(
            `${this.configurationProvider.appSettings.sysConfigApiUrl}`+
            `/lov-management/lovs/lovType=${lovType}`
        );
      }

    }