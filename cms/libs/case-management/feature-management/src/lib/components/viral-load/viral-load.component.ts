/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { ManagementFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'case-management-viral-load',
  templateUrl: './viral-load.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViralLoadComponent {

     /** Public properties **/
     loadViralLoad$ = this.providerFacade.loadViralLoad$;
     public pageSize = 10;
     public skip = 5;
     public pageSizes = [
       {text: '5', value: 5}, 
       {text: '10', value: 10},
       {text: '20', value: 20},
       {text: 'All', value: 100}
     ];
     public formUiStyle : UIFormStyle = new UIFormStyle();
 
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
