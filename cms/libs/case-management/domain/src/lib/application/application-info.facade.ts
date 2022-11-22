import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ApplicantInfo } from '../entities/applicant-info';
import { ApplicantInfoService } from '../infrastructure/applicant-info.service';

@Injectable({ providedIn: 'root' })
export class ApplicationInfoFacade {
    constructor(private readonly applicantInfoService:ApplicantInfoService){

    }

    saveApplicant(applicantInfo:ApplicantInfo) {
        return this.applicantInfoService.saveApplicant(applicantInfo);
    }
   
}
