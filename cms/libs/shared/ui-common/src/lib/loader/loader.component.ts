/** Angular **/
import { Component } from '@angular/core';
import { LoaderService } from '../../../../util-core/src/lib/application/services/app-loader.service';
import { Subject } from 'rxjs';
 


@Component({
  selector: 'common-loader-component',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
 
  isLoading: Subject<boolean> = this.loaderService.isLoading;

  constructor(private loaderService: LoaderService) {
  }
}
