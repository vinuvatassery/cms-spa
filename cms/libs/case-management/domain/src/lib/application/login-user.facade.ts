/** Angular **/
import { Injectable } from '@angular/core';

/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

/** Entities **/
import { LoginUser } from '../entities/login-user';

/** Data services **/
import { LoginUserDataService } from '../infrastructure/login-user.data.service';

@Injectable({ providedIn: 'root' })
export class LoginUserFacade {

    constructor(private readonly loginUserDataService: LoginUserDataService) { }

 /** Private properties **/
 private usersByRoleSubject = new BehaviorSubject<LoginUser[]>([]);

  /** Public properties **/
  usersByRole$ = this.usersByRoleSubject.asObservable();

  getUsersByRole(rolecode : string): void {
        this.loginUserDataService.getUsersByRole(rolecode).subscribe({
          next: (usersByRoleResponse) => {
            this.usersByRoleSubject.next(usersByRoleResponse);
          },
          error: (err) => {
            console.error('err', err);
          },
        });
      }

}



