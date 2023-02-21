/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { ManagementFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'case-management-cd4-count-list',
  templateUrl: './cd4-count.component.html',
  styleUrls: ['./cd4-count.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cd4CountComponent {

   /** Public properties **/
   loadCd4Count$ = this.providerFacade.loadCd4Count$;
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
     this.loadCd4Count();
   }
 
   /** Private methods **/
   private loadCd4Count() {
     this.providerFacade.loadCd4Count();
   }
 
 
}
