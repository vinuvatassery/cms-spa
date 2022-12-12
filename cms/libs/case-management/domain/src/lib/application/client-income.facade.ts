/** Angular **/
import { Injectable } from '@angular/core';
import { IncomeDataService } from '../infrastructure/income.data.service';
@Injectable({ providedIn: 'root' })
export class ClientIncomeFacade {
  /** Constructor**/
  constructor(private readonly IncomeDataService: IncomeDataService) { }

  /** Public methods **/
  deleteIncome(clientIncomeId : string) {
    return this.IncomeDataService.deleteIncome(clientIncomeId)
  }
}
