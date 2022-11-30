/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Dependent } from '../entities/dependent';
/** Data services **/
import { DependentDataService } from '../infrastructure/dependent.data.service';
import { DatePipe } from '@angular/common';
import { FamilyMember, FamilyMember2LabelMapping } from '../enums/family-member.enum';


@Injectable({ providedIn: 'root' })
export class FamilyAndDependentFacade {
  /** Private properties **/
  private dependentSearchSubject = new BehaviorSubject<any>([]);
  private ddlRelationshipsSubject = new BehaviorSubject<any>([]);
  private dependentsSubject = new BehaviorSubject<any>([]);
  private productsSubject = new BehaviorSubject<any>([]);
  public FamilyMember2LabelMapping = FamilyMember2LabelMapping;

  dependentInfo$ !: any[];

  /** Public properties **/
  products$ = this.productsSubject.asObservable();
  
  dependentSearch$ = this.dependentSearchSubject.asObservable();
  ddlRelationships$ = this.ddlRelationshipsSubject.asObservable();
  dependents$ = this.dependentsSubject.asObservable();

  /** Constructor**/
  constructor(private readonly dependentDataService: DependentDataService) {}

  /** Public methods **/
  loadDependentSearch(): void {
    this.dependentDataService.loadDependentSearch().subscribe({
      next: (dependentSearchResponse) => {
        this.dependentSearchSubject.next(dependentSearchResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  public generateDOB(dateOfBirth:Date):number{
    let age:number=0;
    if(dateOfBirth!=null && dateOfBirth!=undefined){
      var timeDiff=Math.abs(Date.now()-new Date(dateOfBirth).getTime())
      age = Math.floor(timeDiff / (1000* 3600*24 ) / 365.25);
    }
    return age;
    
  }
  

  loadDependents(): void {
   
    this.dependentDataService.loadDependents(77).subscribe({
      next: (dependentsResponse) => {
        console.log(dependentsResponse);
        console.log(this.dependentInfo$);
        this.dependentInfo$=[];
        dependentsResponse.forEach(element => {
          console.log(element);
          console.log(this.dependentInfo$);
          this.dependentInfo$.push(
            {
              clientId:element.clientId,
              fullLegalName:element.firstName+" "+element.lastName,
              careAssistClient:element.dependentTypeCode==="C"?"Yes":"No",
              dateOfBirth: new Date(element.dob).toDateString()+" "+"(Age "+ this.generateDOB(element.dob)+ ")",
              insurancePlan:element.enrolledInInsuranceFlag=="N"?"No":"Yes",
              relationshipToClient:this.generateRelationshipString(element.relationshipCode)
            }
            
          )
        });
       console.log(this.dependentInfo$);
      this.dependentsSubject.next(this.dependentInfo$);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlRelationships(): void {
    let relationShipArray:any[];
    this.dependentDataService.loadDdlRelationships().subscribe({
      next: (ddlRelationshipsResponse) => {
        ddlRelationshipsResponse.forEach(element => {
          console.log(element);
          var record=FamilyMember2LabelMapping[element];
          console.log(record);
         relationShipArray.push(FamilyMember2LabelMapping[element])
        });
        this.ddlRelationshipsSubject.next(relationShipArray);
      },
    });
  }


  generateRelationshipString(code:string):string{
   switch(code){
      case "D":return "Daughther";
      break;
      case "S": return "Son";
      break;

      default:return code;
      break;
   }
  }

  loadFamilyDependents(): void {
    this.dependentDataService.loadFamilyDependents().subscribe({
      next: (productsResponse) => {
        this.productsSubject.next(productsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  save():Observable<boolean>{
    //TODO: save api call   
    return of(true);
  }
}
