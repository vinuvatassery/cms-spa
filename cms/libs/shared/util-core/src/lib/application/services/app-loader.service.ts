import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {

  isLoading = new Subject<boolean>();
  public loaderArray:any = [];
  
  show() {
    this.loaderArray.push(1);
     this.isLoading.next(true);
  }

  hide() {
      this.isLoading.next(false);
      this.loaderArray.pop();
  }
}
