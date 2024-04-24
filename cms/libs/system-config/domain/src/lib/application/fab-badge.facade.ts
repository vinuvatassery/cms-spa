/** Angular **/
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FabEntityTypeCode } from '../enums/fab-entity-type-code.enum';


@Injectable({ providedIn: 'root' })
export class FabBadgeFacade {

    private fabMenuReloadSubject = new Subject<any>();
    fabMenuReload$ = this.fabMenuReloadSubject.asObservable();

    reloadFabMenu(entityId: any, entityTypeCode: FabEntityTypeCode){
        const entity = {entityId, entityTypeCode};
        this.fabMenuReloadSubject.next(entity);
    }

}