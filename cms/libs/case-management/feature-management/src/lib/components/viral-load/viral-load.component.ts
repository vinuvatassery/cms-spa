/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { ManagementFacade } from '@cms/case-management/domain';


@Component({
  selector: 'case-management-viral-load',
  templateUrl: './viral-load.component.html',
  styleUrls: ['./viral-load.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViralLoadComponent {

     /** Public properties **/
     loadViralLoad$ = this.providerFacade.loadViralLoad$;
  
 
     /** Constructor **/
     constructor(private readonly providerFacade: ManagementFacade) {}
   
     /** Lifecycle hooks **/
     ngOnInit(): void {
       this.loadViralLoad();
     }
   
     /** Private methods **/
     private loadViralLoad() {
       this.providerFacade.loadViralLoad();
     }
   
}
