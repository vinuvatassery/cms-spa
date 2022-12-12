/** Angular **/
import { Component } from '@angular/core';
 
import { LoaderService } from '@cms/shared/util-core';
import { Subject } from 'rxjs';
 

@Component({
  selector: 'common-loader-component',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
 
  isLoading: Subject<boolean> = this.loaderService.isLoading;

 
  constructor(public loaderService: LoaderService) {
  }

 
}
