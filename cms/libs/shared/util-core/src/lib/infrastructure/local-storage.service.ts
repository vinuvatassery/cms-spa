/** Angular **/
import { Injectable } from '@angular/core';

const APP_PREFIX = 'cms-';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  /** Public methods **/
  setItem(key: string, value: string) {
    localStorage.setItem(APP_PREFIX.concat(key), value);
  }

  getItem(key: string) {
    return localStorage.getItem(APP_PREFIX.concat(key));
  }

  removeItem(key: string) {
    localStorage.removeItem(APP_PREFIX.concat(key));
  }

  clear() {
    localStorage.clear();
  }
}
