import { Inject,Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {

  isLoading = new Subject<boolean>();
  public loaderArray:any = [];
  constructor(@Inject(DOCUMENT) private document: Document) {

    if(this.loaderArray.length === 0){
      this.document.body.classList.remove('app-pageloader-on');
    }
    
  }

  show() {
    this.loaderArray.push(1);
     this.isLoading.next(true);
     this.document.body.classList.add('app-pageloader-on');
  }

  hide() {
      this.isLoading.next(false);
      this.loaderArray.pop();
      if(this.loaderArray.length === 0){
        this.document.body.classList.remove('app-pageloader-on');
      }
  
  }
}
