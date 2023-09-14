import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { ProviderFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-clinic-provider-details',
  templateUrl: './financial-clinic-provider-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClinicProviderDetailsComponent
{
  @Output() clickCloseAddEditProvidersDetails = new EventEmitter();
  @Output() removeProviderDetailsClick= new EventEmitter(); 
  removeProviderOpen = false;
  selectProviderId!: string;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  searchProvider$ = this.ProviderFacade.searchProvider$;
  constructor( private readonly ProviderFacade: ProviderFacade) {}

   searchprovider(searchText: any) 
   {
    if(!searchText || searchText.length == 0)
    {
      return;
    }
    this.ProviderFacade.searchProvider(searchText);
   }

   saveprovider(provider:any) 
   {
    this.ProviderFacade.addProvider(provider)
   } 
}  
