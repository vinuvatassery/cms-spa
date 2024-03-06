import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { GridFilterParam, SystemInterfaceDashboardFacade } from '@cms/system-interface/domain';
import { Subject } from 'rxjs';

@Component({
  selector: 'cms-exception-detail',
  templateUrl: './exception-detail.component.html',
  styleUrls: ['./exception-detail.component.scss'],
})
export class ExceptionDetailComponent implements OnInit, OnChanges {
  public formUiStyle: UIFormStyle = new UIFormStyle();

  @Input() fileId: any;
  @Input() interfaceTypeCode: any;
  @Input() processTypeCode: any;

  batchLogExceptionListsSubject = new Subject<any>();
  batchLogExceptionLists$ = this.batchLogExceptionListsSubject.asObservable();
  keyIdColumnHeader = 'Key Id'
  constructor(
    private systemInterfaceDashboardFacade: SystemInterfaceDashboardFacade
  ) { }

  public state!: any;

  ngOnInit(): void {
    this.initializeGrid();
    this.setKeyIdColumnHeader();
  }
  ngOnChanges(): void {
    this.initializeGrid();
    this.setKeyIdColumnHeader();
  }


  gridLoaderShow = false

  private setKeyIdColumnHeader(): void {
    switch (this.interfaceTypeCode) {
      case 'RAMSELL':
        this.keyIdColumnHeader = 'Claim Number';
        break;
      case 'KAISER':
        this.keyIdColumnHeader = 'Hrn';
        break;
      case 'OHP':
        this.keyIdColumnHeader = 'Recipient Id';
        break;
      case 'MODA':
        this.keyIdColumnHeader = (this.processTypeCode === 'DENTAL_PREMIUM') ? 'Subscriber Id' : 'Claim Number';
        break;
      case 'SRVLNCE':
        this.keyIdColumnHeader = 'Client Id';
        break;
      default:
        break;
    }
  }

  initializeGrid() {
    this.gridLoaderShow = true;

    const param = new GridFilterParam(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      JSON.stringify({ logic: 'and', filters: [] }));

    this.systemInterfaceDashboardFacade.getBatchLogExceptionsLists(this.fileId, this.interfaceTypeCode, this.processTypeCode, param).subscribe({
      next: (dataResponse) => {
        const gridView = {
          data: dataResponse["items"],
          total: dataResponse["totalCount"]
        };
        this.gridLoaderShow = false;
        this.batchLogExceptionListsSubject.next(gridView);
      },
      error: () => {
        this.gridLoaderShow = false;
      },
    });
  }

};

