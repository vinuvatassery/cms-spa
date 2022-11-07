/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { ManagementFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-cd4-count-list',
  templateUrl: './cd4-count.component.html',
  styleUrls: ['./cd4-count.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cd4CountComponent {

   /** Public properties **/
   loadCd4Count$ = this.providerFacade.loadCd4Count$;
  
 
   /** Constructor **/
   constructor(private readonly providerFacade: ManagementFacade) {}
 
   /** Lifecycle hooks **/
   ngOnInit(): void {
     this.loadCd4Count();
   }
 
   /** Private methods **/
   private loadCd4Count() {
     this.providerFacade.loadCd4Count();
   }
 
 
}
