/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
const App_Prefix = "cms-"
@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() {
    console.log("initialized local storage service ");
  }

  SetItem(key:string, value:any){
    localStorage.setItem(App_Prefix.concat(key), value);
  }

  GetItem(key:string){
    return localStorage.getItem(App_Prefix.concat(key));
  }

  RemoveItem(key:string){
    localStorage.removeItem(App_Prefix.concat(key));
  }

  clear(){
    localStorage.clear();
  }
}
