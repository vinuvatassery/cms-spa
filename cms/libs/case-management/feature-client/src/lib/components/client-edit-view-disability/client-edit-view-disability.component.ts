import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ClientFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Observable } from 'rxjs';

@Component({
  selector: 'case-management-client-edit-view-disability',
  templateUrl: './client-edit-view-disability.component.html',
  styleUrls: ['./client-edit-view-disability.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientEditViewDisabilityComponent implements OnInit {

  //@Input() rdoMaterials$:Observable<any>[];

  rdoMaterials$ = this.clientfacade.rdoMaterials$;
  public formUiStyle : UIFormStyle = new UIFormStyle();  
  
  constructor(private readonly clientfacade: ClientFacade) {}

  ngOnInit(): void {}
}
