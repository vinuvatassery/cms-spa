import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CompletionStatusDataService } from '../infrastructure/completion-status.data.service';

@Injectable({ providedIn: 'root' })
export class CompletionStatusFacade {
  private completionStatusSubject = new BehaviorSubject<any>([]);
  completionStatus$ = this.completionStatusSubject.asObservable();
  
  private completionStatus: any;

  constructor(
    private completionStatusDataService: CompletionStatusDataService
  ) {}

  loadCompletionStatus(caseId?: number) {
    this.completionStatusDataService.loadCompletionStatus(caseId).subscribe({
      next: (status) => {
        this.completionStatus = status;
        this.completionStatusSubject.next(status);
      },
      error : (err) => {
        console.log(err);
      }
    });
  }

  updateCompletionStatus(updatedStatus: any) {
    this.completionStatus.forEach((status: any) => {
      if(status.name == updatedStatus.name) {
        status.completed = updatedStatus.completed
      }
    });
    this.completionStatusSubject.next(this.completionStatus);
  }
}
